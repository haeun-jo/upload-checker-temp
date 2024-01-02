import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function ChannelLobby() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("access_token");
  const url =
    "https://port-0-upload-checker-wr4oe2alqv1116q.sel5.cloudtype.app";
  Cookies.set("access_token", token);

  const navigate = useNavigate();

  // 채널 이름을 상태로 관리
  const [channelCode, setChannelCode] = useState("");
  const [channelInfo, setChannelInfo] = useState({});

  const createChannel = async () => {
    try {
      // 쿠키에서 토큰을 가져옴
      const storedToken = Cookies.get("access_token");

      // axios를 사용하여 POST 요청을 보냄
      const response = await axios.post(
        `${url}/channel`,
        {
          name: "nnn", // 채널 이름 추가
          code: "222",
          check_type: "string",
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      // 서버 응답을 처리하거나 상태를 업데이트할 수 있음
      console.log("서버 응답:", response.data);
    } catch (error) {
      // 오류가 발생하면 여기서 처리
      console.error("오류 발생:", error);
    }
  };

  const enterChannel = async () => {
    try {
      // 쿠키에서 토큰을 가져옴
      const storedToken = Cookies.get("access_token");
      console.log(storedToken);

      // axios를 사용하여 POST 요청을 보냄
      const response = await axios.get(`${url}/channel`, {
        params: { channel_code: channelCode },
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      // 서버 응답을 처리하거나 상태를 업데이트할 수 있음
      console.log("서버 응답:", JSON.stringify(response.data.channel));
      setChannelInfo(response.data.channel);
      navigate("/channel", { state: { channelInfo: response.data.channel } });
    } catch (error) {
      // 오류가 발생하면 여기서 처리
      console.error("오류 발생:", error);
    }
  };

  return (
    <div>
      <h1>채널 로비 페이지</h1>
      <p>Token: {token}</p>
      <p>Channel: {JSON.stringify(channelInfo)}</p>

      {/* 채널 이름을 입력받는 input 요소 */}
      <input
        type="text"
        placeholder="채널 코드"
        value={channelCode}
        onChange={(e) => setChannelCode(e.target.value)}
      />

      {/* 버튼 클릭 시 handleButtonClick 함수 호출 */}
      <button onClick={enterChannel}>채널 입장</button>
      <button onClick={createChannel}>채널 생성</button>
    </div>
  );
}

export default ChannelLobby;
