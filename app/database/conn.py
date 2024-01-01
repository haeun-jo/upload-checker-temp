from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
from config import Config
from database.base import Base

config = Config()


DB_URL = f"mysql+pymysql://{config.MYSQL_USER}:{config.MYSQL_PASSWORD}@{config.MYSQL_HOST}:{config.MYSQL_PORT}/{config.MYSQL_DATABASE}?charset=utf8mb4&collation=utf8mb4_unicode_ci&autocommit=true"


class engineconn:
    def __init__(self):
        self.engine = create_engine(DB_URL)

    def sessionmaker(self):
        Session = sessionmaker(bind=self.engine)
        session = Session()
        return session

    def connection(self):
        conn = self.engine.connect()
        return conn

    def init_db(self):
        Base.metadata.create_all(self.engine)
        print("init database completed")
