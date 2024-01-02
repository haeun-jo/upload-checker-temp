import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Channel() {
  const location = useLocation();
  const { channelInfo } = location.state || {};
  const [isChecked, setIsChecked] = useState("");
  const [userList, setUserList] = useState([]);
  const url =
    "https://port-0-upload-checker-wr4oe2alqv1116q.sel5.cloudtype.app";

  const handleButtonClick = async () => {
    try {
      // 쿠키에서 토큰을 가져옴
      const storedToken = Cookies.get("access_token");

      // 출석체크 요청을 보냄
      const response = await axios.post(
        "http://localhost:8000/check",
        {
          channel_id: channelInfo.channel_id,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      // 서버 응답을 처리하거나 상태를 업데이트할 수 있음
      console.log("서버 응답:", response.data);
      setIsChecked("O");
    } catch (error) {
      // 오류가 발생하면 여기서 처리
      console.error("오류 발생:", error);
    }
  };

  const getCheckList = async () => {
    try {
      // 쿠키에서 토큰을 가져옴
      const storedToken = Cookies.get("access_token");

      // 체크 리스트 요청을 보냄
      const response = await axios.get(`${url}/channel/check`, {
        params: { channel_id: channelInfo.channel_id },
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      // 서버 응답을 처리하거나 상태를 업데이트할 수 있음
      console.log("서버 응답:", response.data);
      setUserList(response.data);
    } catch (error) {
      // 오류가 발생하면 여기서 처리
      console.error("오류 발생:", error);
    }
  };

  return (
    <div>
      <h1>채널 페이지</h1>
      <p>Channel: {JSON.stringify(channelInfo.channel_name)}</p>
      <p>출석체크 여부 : {isChecked}</p>
      <p>출석 유저 리스트 : {userList}</p>

      {/* 출석체크 버튼 */}
      <button onClick={handleButtonClick}>출석체크</button>

      {/* 리스트 버튼 */}
      <button onClick={getCheckList}>체크현황</button>
    </div>
  );
}

export default Channel;
