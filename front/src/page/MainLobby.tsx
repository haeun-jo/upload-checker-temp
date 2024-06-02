import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../api/axiosConfig";
import PlusIcon from '../assets/images/icon/ico-plus.svg'
import { useChannelInfoStore } from "../store/channel";

export default function MainLobby() {
  const navigate = useNavigate();
  const setChannelInfo = useChannelInfoStore(state => state.setChannelInfo);

  const [channelCode, setChannelCode] = useState<string>("");

  const enterChannel = async () => {
    try {
      await instance.get("/channel", {
        params: { channel_code: channelCode },
      }).then(res => {
        if(!res.data.channel) { 
          alert("채널이 존재하지 않습니다."); 
          setChannelCode("")
        } else {
          setChannelInfo(res.data.channel);
          navigate("/channel")
        }
      })
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <div className="wrapper items-start justify-start">
      <div className="self-end text-center">
        <button className="w-8 rounded-full bg-button-3 hover:bg-button-2" type="button" onClick={() => navigate("/channel/create")}>
          <img src={PlusIcon} alt="채널 만들기" />
        </button>
        <p className="mt-2 text-primary-5">채널 만들기</p>
      </div>

      <div className="w-full mt-8">
        <p>코드로 입장하기</p>
        <div className="flex justify-between items-center gap-2 mt-2">
          <input 
            className="input flex-auto"
            type="text"
            value={channelCode}
            onChange={(event:ChangeEvent<HTMLInputElement>) => setChannelCode(event.target.value)}
            autoFocus
          />
          <button className="button flex-none" type="button" onClick={enterChannel} disabled={!channelCode}>입장</button>
        </div>
      </div>
      
      <div className="mt-8 w-full">
        <p className="title">내 채널 목록</p>
        <div className="flex justify-between items-center gap-2">
          <span className="flex-auto">채널1</span>
          <button className="button flex-none" type="button">채널 입장</button>
        </div>
        <div>
          <span>채널2</span>
          <button className="button" type="button">채널 입장</button>
        </div>
        <div>
          <span>채널3</span>
          <button className="button" type="button">채널 입장</button>
        </div>
      </div>
    </div>
  );
}
