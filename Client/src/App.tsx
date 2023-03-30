import "./App.css";
import { MainPage } from "./pages/Main";
import { Lobby } from "./pages/Lobby";
import { Room } from "./pages/Room";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route index element={<MainPage />}></Route>
          <Route path="lobby" element={<Lobby />}></Route>
          <Route path="room" element={<Room/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
