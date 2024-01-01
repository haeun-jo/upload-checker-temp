from datetime import datetime, timedelta
from typing import Union
from fastapi import FastAPI, Query
from database.conn import engineconn
from database.base import Base
from database.schema import User
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


# kakao login

"""
1. 카카오 로그인 경로로 요청
2. 카카오가 서버로 redirect
3. redirect로 받은 인가코드로 카카오 인증
4. 인증 완료 후 서버 토큰 발급
"""


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
