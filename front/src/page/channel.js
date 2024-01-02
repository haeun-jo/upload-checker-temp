import React from "react";
import { useLocation } from "react-router-dom";

function Channel() {
  const location = useLocation();
  const { channelInfo } = location.state || {};
  console.log(location.state);

  return (
    <div>
      <h1>채널 페이지</h1>
      <p>Channel: {JSON.stringify(channelInfo)}</p>

      {/* 채널 이름을 입력받는 input 요소 */}

      {/* 버튼 클릭 시 handleButtonClick 함수 호출 */}
    </div>
  );
}

export default Channel;
