from sqlalchemy import func, DateTime, Column, TEXT, INTEGER, BIGINT, String
from database.base import Base


class User(Base):
    __tablename__ = "user"

    user_id = Column(INTEGER, primary_key=True, nullable=False, autoincrement=True)
    user_name = Column(String(30), nullable=False)


class Channel(Base):
    __tablename__ = "channel"

    channel_id = Column(INTEGER, primary_key=True, nullable=False, autoincrement=True)
    channel_name = Column(String(30), nullable=False)
    channel_creator_id = Column(INTEGER, nullable=False)
    channel_user_count = Column(INTEGER, nullable=False, default=0)
    channel_check_type = Column(String(10), nullable=False)
    updated_at = Column(DateTime, default=func.current_timestamp())
    created_at = Column(DateTime, default=func.current_timestamp())


class Check(Base):
    __tablename__ = "check"

    check_id = Column(INTEGER, primary_key=True, nullable=False, autoincrement=True)
    check_channel_id = Column(INTEGER, nullable=False)
    check_user_id = Column(INTEGER, nullable=False)
    updated_at = Column(DateTime, default=func.current_timestamp())
    created_at = Column(DateTime, default=func.current_timestamp())
