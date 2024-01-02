import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SocialKakao from "./page/socialKakao";
import ChannelLobby from "./page/channelLobby";
import Channel from "./page/channel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SocialKakao />} />
        <Route path="/main" element={<ChannelLobby />} />
        <Route path="/channel" element={<Channel />} />
      </Routes>
    </Router>
  );
}

export default App;
