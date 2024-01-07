import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function CreateChannel() {
  const [channelName, setChannelName] = useState("");
  const [channelCode, setChannelCode] = useState("");
  const Cloudurl =
    "https://port-0-upload-checker-wr4oe2alqv1116q.sel5.cloudtype.app";
  const Localurl = "http://localhost:8000";
  const url = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const postChannel = async () => {
    try {
      // 쿠키에서 토큰을 가져옴
      const storedToken = Cookies.get("access_token");
      console.log(storedToken);

      // 출석체크 요청을 보냄
      const response = await axios.post(
        `${url}/channel`,
        {
          name: channelName,
          code: channelCode,
          check_type: "check",
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      // 서버 응답을 처리하거나 상태를 업데이트할 수 있음
      console.log("서버 응답:", response.data);
      navigate("/main");
    } catch (error) {
      // 오류가 발생하면 여기서 처리
      console.error("오류 발생:", error);
    }
  };

  return (
    <div>
      <h1>채널 생성 페이지</h1>

      {/* 채널 이름을 입력받는 input 요소 */}
      <div>
        <label htmlFor="channelName">채널 이름:</label>
        <input
          type="text"
          id="channelName"
          placeholder="채널 이름"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
      </div>

      {/* 채널 코드를 입력받는 input 요소 */}
      <div>
        <label htmlFor="channelCode">채널 코드:</label>
        <input
          type="text"
          id="channelCode"
          placeholder="채널에 입장하기 위한 코드입니다"
          value={channelCode}
          onChange={(e) => setChannelCode(e.target.value)}
        />
      </div>

      {/* 채널 생성 버튼 */}
      <button onClick={postChannel}>채널 생성</button>
    </div>
  );
}

export default CreateChannel;
