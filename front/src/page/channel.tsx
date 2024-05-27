import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import instance from "../api/axiosConfig";

export default function ChannelRoom() {
  const location = useLocation();
  const { channelInfo } = location.state || {};
  const [isChecked, setIsChecked] = useState("");
  const [totalCheckList, setTotalCheckList] = useState([]);
  const [todayCheckList, setTodayCheckList] = useState([]);
  const [myCheckList, setMyCheckList] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [summarySwitch, setSummarySwitch] = useState(true);

  const navigate = useNavigate();

  const postCheck = async () => {
    try {
      // 출석체크 요청을 보냄
      await instance.post( "/check", {
          channel_id: channelInfo.channel_id,
        },
      ).then(res => {
      console.log("서버 응답:", res);
      setIsChecked("O");
      })
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  const getTodayCheckList = async () => {
    try {
      setEndDate(null);

      // 체크 리스트 요청을 보냄
      const response = await instance.get(`/channel/check`, {
        params: {
          channel_id: channelInfo.channel_id,
          start_date: startDate && startDate.toISOString().split("T")[0],
          end_date: "",
        },
      });

      // 서버 응답을 처리하거나 상태를 업데이트할 수 있음
      console.log("서버 응답:", response.data);
      setTotalCheckList([]);
      setMyCheckList([]);
      setTodayCheckList(response.data);
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  const getTotalCheckList = async () => {
    try {
      if (!(startDate && endDate)) {
        alert("기간 조회를 위해 시작일과 종료일을 지정해주세요.");
        return false;
      }

      if (startDate > endDate) {
        alert("시작일이 종료일보다 뒤에 있습니다.");
        return false;
      }

      // 체크 리스트 요청을 보냄
      const response = await instance.get("/channel/check", {
        params: {
          channel_id: channelInfo.channel_id,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate !== null ? endDate.toISOString().split("T")[0] : "",
        },
      });
      console.log("서버 응답:", response.data);
      setTodayCheckList([]);
      setMyCheckList([]);
      setTotalCheckList(response.data);
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  const getMyCheckList = async () => {
    try {
      // 체크 리스트 요청을 보냄

      if (!(startDate && endDate)) {
        alert("나의 출석체크 조회를 위해 시작일과 종료일을 지정해주세요.");
        return false;
      }

      if (startDate > endDate) {
        alert("시작일이 종료일보다 뒤에 있습니다.");
        return false;
      }

      const response = await instance.get("/user/check", {
        params: {
          channel_id: channelInfo.channel_id,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate !== null ? endDate.toISOString().split("T")[0] : "",
        },
      });

      console.log("서버 응답:", response.data);
      setTodayCheckList([]);
      setTotalCheckList([]);
      setMyCheckList(response.data);
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <div className="wrapper">
      <h1>채널 페이지</h1>
      <p>Channel: {JSON.stringify(channelInfo.channel_name)}</p>

      {/* 출석체크 버튼 */}
      <button onClick={() => navigate("/main")}>로비로</button>
      {/* 출석체크 버튼 */}
      <button onClick={postCheck}>출석체크</button>

      {/* 리스트 버튼 */}
      <button onClick={getTodayCheckList}>하루조회</button>
      <button onClick={getTotalCheckList}>기간조회</button>
      <button onClick={getMyCheckList}>나의 출석조회</button>
      <p>출석체크 여부 : {isChecked}</p>

      {/* 날짜 선택 UI */}
      <div>
        <label>시작일:</label>
        <DatePicker
          dateFormat='yyyy.MM.dd' // 날짜 형태
          shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
          minDate={new Date('2000-01-01')} // minDate 이전 날짜 선택 불가
          maxDate={new Date()} // maxDate 이후 날짜 선택 불가
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
            {/* {totalCheckList.map((entry, index) => (
              <tr key={index} onClick={() => setSummarySwitch(!summarySwitch)}>
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
            ))} */}
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
            {/* {todayCheckList.map((entry, index) => (
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
            ))} */}
          </tbody>
        </table>
      )}
      {myCheckList.length > 0 && (
        <table className="tableWithBorder">
          <thead>
            <tr>
              <th>날짜</th>
              <th>나의 출석 여부</th>
            </tr>
          </thead>
          <tbody>
            {/* {myCheckList.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.check}</td>
              </tr>
            ))} */}
          </tbody>
        </table>
      )}
    </div>
  );
}

