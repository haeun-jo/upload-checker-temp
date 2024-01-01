from database.conn import engineconn
from database.schema import User, Channel, Check

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


async def get_channel(creator_id):
    print(creator_id, "@@@@", type(creator_id))
    try:
        data = (
            session.query(Channel)
            .filter(Channel.channel_creator_id == creator_id)
            .first()
        )
        return data

    except:
        None


################################################################
# check
################################################################


def add_check(check):
    try:
        session.add(check)
        session.commit()
    except:
        return None


def get_check(user_id, channel_id):
    try:
        data = (
            session.query(Check)
            .filter(Check.check_user_id == user_id)
            .filter(Check.check_channel_id == channel_id)
            .first()
        )
        return data

    except:
        None
