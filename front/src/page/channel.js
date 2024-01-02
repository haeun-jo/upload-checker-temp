import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Channel() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("access_token");

  // 토큰을 쿠키에 저장
  Cookies.set("access_token", token);

  const handleButtonClick = async () => {
    try {
      // 쿠키에서 토큰을 가져옴
      const storedToken = Cookies.get("access_token");

      // axios를 사용하여 POST 요청을 보냄
      const response = await axios.post(
        "http://localhost:8000/channel",
        {
          name: "name1234",
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

  return (
    <div>
      <h1>채널 페이지</h1>
      <p>token : {token}</p>
      <button onClick={handleButtonClick}>POST 요청 보내기</button>
    </div>
  );
}

export default Channel;
