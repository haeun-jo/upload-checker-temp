from datetime import datetime, timedelta
from typing import Annotated, Union
from fastapi import Body, Depends, FastAPI, Query
from api_model.model import ChannelModel, CheckModel
from database.query import add_channel, get_channel, add_check, get_check
from util.auth import get_current_user
from database.conn import engineconn
from database.base import Base
from database.schema import User, Channel, Check
from config import Config
from starlette.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, HTTPBearer
from util.oauth import kakao_login, kakao_token
from util.auth import create_access_token, encode_token


import logging

oauth2_scheme = HTTPBearer()

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


@app.get("/oauth/kakao/redirect", status_code=200)
def kakao_user_login(code: str = Query(..., description="카카오 인증코드")):
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


@app.post("/channels", status_code=200)
async def post_channel(
    params: ChannelModel,
    token: HTTPBearer = Depends(oauth2_scheme),
):
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
    channel_result = await get_channel(user.user_id)
    return channel_result


@app.post("/check", status_code=200)
async def post_check(params: CheckModel, token: HTTPBearer = Depends(oauth2_scheme)):
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
