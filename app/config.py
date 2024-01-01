from starlette.config import Config
from dotenv import load_dotenv

load_dotenv()

config = Config(".env")


class Config:
    MYSQL_ROOT_PASSWORD = 123456
    MYSQL_DATABASE = "uploadChecker"
    MYSQL_USER = "checker"
    MYSQL_PASSWORD = 123456
    MYSQL_PORT = 3306
    MYSQL_HOST = "mysql"

    def __init__(self):
        self.config = config

    def __call__(self):
        return self.config
