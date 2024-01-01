from datetime import datetime
from pydantic import BaseModel


class ChannelModel(BaseModel):
    name: str = "name"
    check_type: str


class CheckModel(BaseModel):
    channel_id: int = 1
