import { ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function GetUserInfo () {
  const navigate = useNavigate();
  const [nickname, setNickName] = useState<string>("")  

  return (
    <div className="wrapper items-center justify-center text-center">
      <label>닉네임을 실명으로 설정해 주세요.
        <input className="input block mt-2 mx-auto" autoFocus value={nickname} onChange={(event: ChangeEvent<HTMLInputElement>) => setNickName(event.target.value)} />
      </label>
      <label className="block mt-6">소속 되어있는 팀을 선택해 주세요.
        <select name="cars" className="block mt-2 mx-auto py-1 px-2 rounded-md outline-none">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
      </label>
      <button 
        className="button mt-8" 
        type="submit" 
        onClick={() => {
          navigate('/lobby');
        }} 
        disabled={!nickname}>
          저장
        </button>
    </div>
  )
}