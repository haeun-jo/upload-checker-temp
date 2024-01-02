import { Link } from "react-router-dom";

function Main() {
  return (
    <div>
      <div>
        <h1>메인페이지</h1>
      </div>
      <div>
        <a id="kakao-login-btn" href="javascript:loginWithKakao()">
          <img
            src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
            width="222"
            alt="카카오 로그인 버튼"
          />
        </a>
      </div>
    </div>
  );
}

export default Main;
