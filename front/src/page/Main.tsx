import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import instance from "../api/axiosConfig";

export default function Main() {
  const navigate = useNavigate();
 
  const [channelCode, setChannelCode] = useState<string>("");
  const [channelInfo, setChannelInfo] = useState({});

  const enterChannel = async () => {
    try {
      const response = await instance.get("/channel", {
        params: { channel_code: channelCode },
      });

      // 서버 응답을 처리하거나 상태를 업데이트할 수 있음
      console.log("서버 응답:", JSON.stringify(response.data.channel));
      if (response.data.channel === null) {
        alert("채널이 존재하지 않습니다.");
      } else {
        setChannelInfo(response.data.channel);
        navigate("/channel", { state: { channelInfo: response.data.channel } });
      }
    } catch (error) {
      // 오류가 발생하면 여기서 처리
      console.error("오류 발생:", error);
    }
  };

  return (
    <div className="wrapper">
      <h1>채널 로비 페이지</h1>
      <p>Channel: {JSON.stringify(channelInfo)}</p>

      {/* 채널 이름을 입력받는 input 요소 */}
      <input
        type="text"
        placeholder="채널 코드를 입력해 주세요."
        value={channelCode}
        onChange={(e) => setChannelCode(e.target.value)}
      />

      {/* 버튼 클릭 시 handleButtonClick 함수 호출 */}
      <button onClick={enterChannel}>채널 입장</button>
      <button type="button" onClick={() => navigate("/channel/create")}>채널 생성</button>
    </div>
  );
}
