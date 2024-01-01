from database.conn import engineconn
from database.schema import User, Channel, Check
from sqlalchemy import cast, Date

engine = engineconn()
session = engine.sessionmaker()


################################################################
# user
################################################################
def get_user(username):
    try:
        return session.query(User).filter(User.user_name == username).first()
    except:
        return None


################################################################
# channel
################################################################
def add_channel(channel):
    try:
        session.add(channel)
        session.commit()
    except:
        return None


async def get_channel(creator_id, channel_name):
    try:
        data = (
            session.query(Channel)
            .filter(Channel.channel_creator_id == creator_id)
            .filter(Channel.channel_name == channel_name)
            .first()
        )
        return data

    except:
        None


################################################################
# check
################################################################


def add_check(check):
    # TODO: 중복여부 확인 처리 추가해야함
    try:
        session.add(check)
        session.commit()
    except:
        return None


def get_check(user_id, channel_id, created_at=None):
    try:
        if created_at:
            data = (
                session.query(Check)
                .filter(Check.check_user_id == user_id)
                .filter(Check.check_channel_id == channel_id)
                .filter(cast(Check.created_at, Date) == created_at)
                .first()
            )
            return data
        return (
            session.query(Check)
            .filter(Check.check_user_id == user_id)
            .filter(Check.check_channel_id == channel_id)
            .first()
        )

    except:
        return None


def get_user_checks_channel(channel_id: int) -> User:
    try:
        data = (
            session.query(Check.check_user_id, User.user_name)
            .join(User, Check.check_user_id == User.user_id)
            .filter(Check.check_channel_id == channel_id)
            .group_by(Check.check_user_id)
            .all()
        )

        return data
    except:
        return None
