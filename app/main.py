from typing import Union
from fastapi import FastAPI, Query

from api_model.model import userLoginModel

import logging
import json

app = FastAPI()

# logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


# get plan
@app.post("/login")
def login(params: userLoginModel):
    logger.info("start request")
