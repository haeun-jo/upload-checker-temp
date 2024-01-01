from datetime import datetime, timedelta
from typing import Union
from fastapi import FastAPI, Query
from database.conn import engineconn
from database.base import Base
from database.schema import User
from config import Config
from starlette.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from logging import error
from auth import create_access_token


import logging
import httpx

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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


# kakao login

"""
1. 카카오 로그인 경로로 요청
2. 카카오가 서버로 redirect
3. redirect로 받은 인가코드로 카카오 인증
4. 인증 완료 후 서버 토큰 발급
"""

KAKAO_APP_KEY = "635065823fa42e337885faea9b31f3f4"
KAKAO_REDIRECT_URI = "http://localhost:8000/oauth/kakao/redirect"
KAKAO_AUTH_URI = "https://kauth.kakao.com/oauth/token"
KAKAO_USER_URI = "https://kapi.kakao.com/v2/user/me"


"""
http://localhost:8000/oauth/kakao/redirect?code=914rIhV3Epl2n9ls6YZL3Kh766OxdsqOe-WQPokOlHqikSB1Neq4URoHYIgKPXRpAAABjMONm8Gxu3fh8M0xkQ
"""


def encode_token(username):
    if username:
        return create_access_token(
            data={"sub": username}, expires_delta=timedelta(weeks=5)
        )
    else:
        return error


@app.get("/oauth/kakao/redirect", status_code=200)
def kakao_user_login(code: str = Query(..., description="카카오 인증코드")):
    kakao_access_token = kakao_token(code).get("access_token")
    kakao_user = kakao_login(kakao_access_token)
    nickname = kakao_user["properties"]["nickname"]

    # check user exist on DB
    if not session.query(User).filter(User.user_name == nickname).all():
        print("User already exists")
        # add user
        user = User(user_name=nickname)
        session.add(user)

    # create token
    token = encode_token(nickname)
    return {"access_token": token}


def kakao_token(code: str):
    """
    카카오 인증코드를 받아 카카오 인증 api를 호출하고 토큰을 return 한다.
    """

    # send request to KAKAO auth
    with httpx.Client() as client:
        header = {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}
        body = {
            "grant_type": "authorization_code",
            "client_id": KAKAO_APP_KEY,
            "redirect_uri": KAKAO_REDIRECT_URI,
            "code": code,
        }
        response = client.post(url=KAKAO_AUTH_URI, headers=header, data=body)
        result = response.json()

    return result


def kakao_login(token):
    """
    카카오 토큰을 받아 유저 정보를 가져옵니다.
    """
    # send request to KAKAO user
    with httpx.Client() as client:
        header = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        }
        response = client.get(url=KAKAO_USER_URI, headers=header)
        result = response.json()
        print("login", result)

    return result
