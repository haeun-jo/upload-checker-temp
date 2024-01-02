const SocialKakao = () => {
  const Rest_api_key = "635065823fa42e337885faea9b31f3f4"; //REST API KEY
  const redirect_uri =
    "https://port-0-upload-checker-wr4oe2alqv1116q.sel5.cloudtype.app/oauth/kakao/redirect"; //Redirect URI
  const local_Redirect_uri = "http://localhost:8000/oauth/kakao/redirect"; //Redirect URI

  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${local_Redirect_uri}&response_type=code`;
  const handleLogin = () => {
    window.location.href = kakaoURL;
  };
  return (
    <>
      <img
        src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
        width="222"
        alt="카카오 로그인 버튼"
        onClick={handleLogin}
      />
    </>
  );
};
export default SocialKakao;
