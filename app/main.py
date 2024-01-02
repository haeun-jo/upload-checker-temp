from datetime import datetime, timedelta
from typing import Annotated, Union
from fastapi import Body, Depends, FastAPI, Query, Request
from api_model.model import ChannelModel, CheckModel
from database.query import (
    add_channel,
    get_channel,
    get_channel_with_name,
    add_check,
    get_check,
    get_user_checks_channel,
    add_user,
    get_user,
    get_users,
)
from util.auth import get_current_user
from database.conn import engineconn
from database.base import Base
from database.schema import User, Channel, Check
from config import Config
from starlette.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, HTTPBearer
from util.oauth import kakao_login, kakao_token
from util.auth import create_access_token, encode_token
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

import logging

oauth2_scheme = HTTPBearer()

# template
templates = Jinja2Templates(directory="templates")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# db connection

engine = engineconn()
session = engine.sessionmaker()
Base.metadata.create_all(bind=engine.engine)

# get config
config = Config()


"""
http://localhost:8000/oauth/kakao/redirect?code=914rIhV3Epl2n9ls6YZL3Kh766OxdsqOe-WQPokOlHqikSB1Neq4URoHYIgKPXRpAAABjMONm8Gxu3fh8M0xkQ
"""


@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/oauth/kakao/redirect", status_code=200)
def kakao_user_login_api(code: str = Query(..., description="카카오 인증코드")):
    """
    카카오의 인증코드를 redirect 받아 인증절차를 거친 뒤, token을 return 합니다.
    """
    kakao_access_token = kakao_token(code).get("access_token")
    kakao_user = kakao_login(kakao_access_token)
    nickname = kakao_user["properties"]["nickname"]

    # check user exist on DB
    if not session.query(User).filter(User.user_name == nickname).all():
        print("User doesn't exists")
        # add user
        user = User(user_name=nickname)
        session.add(user)

    # create token
    token = encode_token(nickname)
    return {"access_token": token}


@app.post("/channel", status_code=200)
async def post_channel_api(
    params: ChannelModel,
    token: HTTPBearer = Depends(oauth2_scheme),
):
    """
    생성하고자 하는 채널의 정보를 받아 채널을 생성하고, 만들어진 채널의 정보를 return 합니다.
    """
    input = params.dict()

    # check user
    user = await get_current_user(token)

    # create channel
    channel = Channel(
        channel_name=input.get("name"),
        channel_creator_id=user.user_id,
        channel_check_type=input.get("check_type"),
    )
    add_channel(channel)

    # get channel
    channel_result = await get_channel_with_name(
        creator_id=user.user_id, 
        channel_name=channel.channel_name)
    return channel_result


@app.post("/check", status_code=200)
async def post_check_api(
    params: CheckModel, token: HTTPBearer = Depends(oauth2_scheme)
):
    """
    출석하고자 하는 채널의 아이디를 받고 출석체크를 한 뒤, 출석 정보를 return 합니다.
    """
    input = params.dict()

    # check user
    user = await get_current_user(token)

    # check
    check = Check(
        check_channel_id=input.get("channel_id"),
        check_user_id=user.user_id,
    )

    add_check(check)

    # get check
    check_result = get_check(user.user_id, input.get("channel_id"))

    return check_result


@app.get("/check", status_code=200)
async def get_check_api(
    channel_id: int = Query(default=0), token: HTTPBearer = Depends(oauth2_scheme)
):
    """
    채널 아이디를 확인하여, 현재 유저가 출석을 했는지 여부를 확인하여 출석 정보를 return 합니다.
    """
    # check user
    user = await get_current_user(token)

    # get current_date check
    current_date_str = datetime.now().strftime("%Y-%m-%d")
    check_result = get_check(
        channel_id=channel_id, user_id=user.user_id, created_at=current_date_str
    )

    return check_result


@app.get("/channel/check", status_code=200)
async def get_check_channel_api(
    channel_id: int = Query(default=0), token: HTTPBearer = Depends(oauth2_scheme)
):
    """
    채널의 생성자가 사용합니다. 채널 내의 오늘 기준 체크한 사람의 목록을 확인힐 수 있습니다.
    """

    # check user
    user = await get_current_user(token)
    print("user: %s" % user.user_id)

    # check channel creator
    channel = await get_channel(channel_id)
    print("channel: %s" % channel.channel_creator_id, channel.channel_id)
    if channel is None:
        return None
    if channel.channel_creator_id != user.user_id:
        return "채널의 생성자가 아닙니다"

    # get checks of channel
    current_date_str = datetime.now().strftime("%Y-%m-%d")
    checks = get_user_checks_channel(channel_id, current_date_str)
    print("checks: %s" % checks)

    return list(map(lambda x: x.user_name, checks))


@app.post("/dummy/user", status_code=200)
async def dummy_user(user_name: str):
    """
    dummy 유저를 생성합니다.
    """

    # add dummy user
    user = User(user_name=user_name)
    add_user(user)

    # get user
    user_result = get_user(user_name)

    return user_result


@app.post("/dummy/check", status_code=200)
async def dummy_check(
    channel_id: int = Body(default=0), user_id: int = Body(default=0)
):
    """
    dummy로 체크할 수 있는 api 입니다. 채널과 유저 아이디를 받아 체크합니다.
    """

    # dummy check
    check = Check(
        check_channel_id=channel_id,
        check_user_id=user_id,
    )
    add_check(check)

    # get check
    today = datetime.now().strftime("%Y-%m-%d")
    check_result = get_check(user_id, channel_id, today)

    return check_result


@app.get("/user/list", status_code=200)
async def user_list_api():
    return get_users()
