import { BrowserRouter, Routes, Route} from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import PlayPage from "./pages/PlayPage/PlayPage";
import Disclaimer from "./components/Disclaimer/Disclaimer";
import FontEffectTests from "./pages/FontEffectTests/FontEffectTests";

import "./App.scss";

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fonttests/" element={<FontEffectTests />} />
        <Route path="/game/:numPlayers" element={<PlayPage />} />
        <Route path="/game/" element={<PlayPage />} />
        
        
      </Routes>
      <Disclaimer />
    </BrowserRouter>
  );
}

export default App;
