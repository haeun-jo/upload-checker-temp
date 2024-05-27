import  { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../api/axiosConfig";

function CreateChannel() {
  const navigate = useNavigate();

  const [channelName, setChannelName] = useState<string>("");
  const [channelCode, setChannelCode] = useState<string>("");

  const fetchPostCreateChannel = async () => {
    try {
      await instance.post( "/channel", {
          name: channelName,
          code: channelCode,
          check_type: "check",
        },
      ).then(res => {
        console.log("서버 응답:", res.data);
        alert("채널이 생성되었습니다.")
        navigate("/main");
      })
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <div className="wrapper items-center justify-center">
      <label className="block">채널의 이름을 입력해 주세요.
        <input
          className="input mx-auto block mt-2"
          type="text"
          id="channelName"
          placeholder="채널 이름"
          value={channelName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setChannelName(event.target.value)}
        />
      </label>
      <label className="block mt-4">채널 입장에 필요한 코드를 입력해 주세요.
        <input
          className="input mx-auto block mt-2"
          type="text"
          id="channelCode"
          placeholder="채널 코드"
          value={channelCode}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setChannelCode(event.target.value)}
        />
      </label>
      <div className="mt-6">
        <button className="button" type="button" onClick={fetchPostCreateChannel}>채널 생성</button>
        <button className="button ml-2" type="button" onClick={()=>navigate("/main")}>목록</button>
      </div>
    </div>
  );
}

export default CreateChannel;
