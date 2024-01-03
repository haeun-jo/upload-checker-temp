from database.conn import engineconn, db
from database.schema import User, Channel, Check
from sqlalchemy import cast, Date
from sqlalchemy.orm import Session


################################################################
# user
################################################################
def get_user(session: Session, username):
    try:
        return session.query(User).filter(User.user_name == username).first()
    except Exception as e:
        print(e)
        return None


def get_users(session):
    try:
        return session.query(User).all()
    except Exception as e:
        print(e)
        return None


def add_user(session, user):
    try:
        session.add(user)
        session.commit()
    except Exception as e:
        print(e)
        session.rollback()
        return None


################################################################
# channel
################################################################
def add_channel(session, channel):
    try:
        session.add(channel)
        session.commit()
    except Exception as e:
        print(e)
        session.rollback()
        return None


async def get_channel_with_name(session, creator_id, channel_name):
    try:
        data = (
            session.query(Channel)
            .filter(Channel.channel_creator_id == creator_id)
            .filter(Channel.channel_name == channel_name)
            .first()
        )
        return data

    except Exception as e:
        print(e)
        None


async def get_channel(session, channel_id):
    try:
        data = session.query(Channel).filter(Channel.channel_id == channel_id).first()
        return data

    except Exception as e:
        print(e)
        None


async def get_channel_with_code(session, channel_code):
    try:
        data = (
            session.query(Channel).filter(Channel.channel_code == channel_code).first()
        )
        return data

    except Exception as e:
        print(e)
        None


################################################################
# check
################################################################


def add_check(session, check):
    # TODO: 중복여부 확인 처리 추가해야함
    try:
        session.add(check)
        session.commit()
    except Exception as e:
        print(e)
        session.rollback()
        return None


def get_check(session, user_id, channel_id, created_at=None):
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

    except Exception as e:
        print(e)
        return None


def get_user_checks_channel(session, channel_id: int, created_at=None) -> User:
    try:
        if created_at is not None:
            data = (
                session.query(Check.check_user_id, User.user_name)
                .join(User, Check.check_user_id == User.user_id)
                .filter(Check.check_channel_id == channel_id)
                .filter(cast(Check.created_at, Date) == created_at)
                .group_by(Check.check_user_id)
                .all()
            )
            return data
        return (
            session.query(Check.check_user_id, User.user_name)
            .join(User, Check.check_user_id == User.user_id)
            .filter(Check.check_channel_id == channel_id)
            .group_by(Check.check_user_id)
            .all()
        )
    except Exception as e:
        print(e)
        return None
