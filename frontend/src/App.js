import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [health, setHealth] = useState("…");

  useEffect(() => {
    axios.get("/api/health").then((res) => setHealth(res.data.status));
  }, []);

  return <h1>Backend says: {health}</h1>;
}

export default App;

