import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/channel.css";

function Channel() {
  const location = useLocation();
  const { channelInfo } = location.state || {};
  const [isChecked, setIsChecked] = useState("");
  const [totalCheckList, setTotalCheckList] = useState([]);
  const [todayCheckList, setTodayCheckList] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState("");
  const [summarySwitch, setSummarySwitch] = useState(true);
  const cloudUrl =
    "https://port-0-upload-checker-wr4oe2alqv1116q.sel5.cloudtype.app";
  const localUrl = "http://localhost:8000";
  const url = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const postCheck = async () => {
    try {
      // 쿠키에서 토큰을 가져옴
      const storedToken = Cookies.get("access_token");

      // 출석체크 요청을 보냄
      const response = await axios.post(
        `${url}/check`,
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

  const moveLobby = async () => {
    navigate("/main");
  };

  const getTodayCheckList = async () => {
    try {
      // 쿠키에서 토큰을 가져옴
      const storedToken = Cookies.get("access_token");
      setEndDate("");

      // 체크 리스트 요청을 보냄
      const response = await axios.get(`${url}/channel/check`, {
        params: {
          channel_id: channelInfo.channel_id,
          start_date: startDate.toISOString().split("T")[0],
          end_date: "",
        },
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      // 서버 응답을 처리하거나 상태를 업데이트할 수 있음
      console.log("서버 응답:", response.data);
      setTotalCheckList([]);
      setTodayCheckList(response.data);
    } catch (error) {
      // 오류가 발생하면 여기서 처리
      console.error("오류 발생:", error);
    }
  };

  const getTotalCheckList = async () => {
    try {
      // 쿠키에서 토큰을 가져옴
      const storedToken = Cookies.get("access_token");

      if (!(startDate && endDate)) {
        alert("기간 조회를 위해 시작일과 종료일을 지정해주세요.");
        return false;
      }

      if (startDate > endDate) {
        alert("시작일이 종료일보다 뒤에 있습니다.");
        return false;
      }

      // 체크 리스트 요청을 보냄
      const response = await axios.get(`${url}/channel/check`, {
        params: {
          channel_id: channelInfo.channel_id,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate !== "" ? endDate.toISOString().split("T")[0] : "",
        },
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      // 서버 응답을 처리하거나 상태를 업데이트할 수 있음
      console.log("서버 응답:", response.data);
      setTodayCheckList([]);
      setTotalCheckList(response.data);
    } catch (error) {
      // 오류가 발생하면 여기서 처리
      console.error("오류 발생:", error);
    }
  };

  const changeSummarySwitch = async () => {
    setSummarySwitch(!summarySwitch);
  };

  return (
    <div>
      <h1>채널 페이지</h1>
      <p>Channel: {JSON.stringify(channelInfo.channel_name)}</p>

      {/* 출석체크 버튼 */}
      <button onClick={moveLobby}>로비로</button>
      {/* 출석체크 버튼 */}
      <button onClick={postCheck}>출석체크</button>

      {/* 리스트 버튼 */}
      <button onClick={getTodayCheckList}>하루조회</button>
      <button onClick={getTotalCheckList}>기간조회</button>
      <p>출석체크 여부 : {isChecked}</p>

      {/* 날짜 선택 UI */}
      <div>
        <label>시작일:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </div>
      <div>
        <label>종료일:</label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
      </div>
      {totalCheckList.length > 0 && (
        <table className="tableWithBorder">
          <thead>
            <tr>
              <th>날짜</th>
              <th>출석 수</th>
              <th>출석한 사용자</th>
            </tr>
          </thead>
          <tbody>
            {totalCheckList.map((entry, index) => (
              <tr key={index} onClick={changeSummarySwitch}>
                <td>{entry.date}</td>
                <td>{entry.checks.length}</td>
                <td>
                  {summarySwitch ? (
                    <ul
                      style={{ listStyleType: "none", paddingInlineStart: "0" }}
                    >
                      {entry.checks.length > 0 ? (
                        <li key={index}>
                          {entry.checks.length > 1
                            ? `${entry.checks[0]} 외 ${
                                entry.checks.length - 1
                              } 명`
                            : entry.checks[0]}
                        </li>
                      ) : (
                        <li key={index}>-</li>
                      )}
                    </ul>
                  ) : (
                    <ul
                      style={{ listStyleType: "none", paddingInlineStart: "0" }}
                    >
                      {entry.checks.map((user, userIndex) => (
                        <li key={userIndex}>{user}</li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {todayCheckList.length > 0 && (
        <table className="tableWithBorder">
          <thead>
            <tr>
              <th>날짜</th>
              <th>출석 수</th>
              <th>출석한 사용자</th>
            </tr>
          </thead>
          <tbody>
            {todayCheckList.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.checks.length}</td>
                <td>
                  <ul
                    style={{ listStyleType: "none", paddingInlineStart: "0" }}
                  >
                    {entry.checks.map((user, userIndex) => (
                      <li key={userIndex}>{user}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Channel;
