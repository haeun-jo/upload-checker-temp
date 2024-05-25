
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SocialKakao from "./page/socialKakao";
import Main from "./page/Main";
import Channel from "./page/channel";
import CreateChannel from "./page/createChannel";
import GetToken from "./page/getToken";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SocialKakao />} />
        <Route path="/main" element={<Main />} />
        <Route path="/getToken" element={<GetToken />} />
        <Route path="/channel" element={<Channel />} />
        <Route path="/channel/create" element={<CreateChannel />} />
      </Routes>
    </Router>
  );
}

