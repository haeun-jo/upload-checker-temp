import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SocialKakao from "./page/socialKakao";
import ChannelLobby from "./page/channelLobby";
import Channel from "./page/channel";
import CreateChannel from "./page/createChannel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SocialKakao />} />
        <Route path="/main" element={<ChannelLobby />} />
        <Route path="/channel" element={<Channel />} />
        <Route path="/channel/create" element={<CreateChannel />} />
      </Routes>
    </Router>
  );
}

export default App;
