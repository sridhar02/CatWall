import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

const Header = () => {
  return (
    <div className="w-full sticky top-0 h-16 bg-indigo-500 mb-4">
      <h1 className="text-2xl font-bold text-center py-4 text-white">
        Cats Wall
      </h1>
    </div>
  )
}


function App() {
  const [cats, setCats] = useState([]);

  const fetchCats = async (params) => {
    try {
      const apiResponse = await fetch(
        `https://api.thecatapi.com/v1/images/search?limit=50`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_SOME_KEY,
          },
        }
      );
      const result = await apiResponse.json();
      setCats(result);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCats();
  }, []);


  return (
    <div className="h-screen w-screen bg-blue-300">
      <Header />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
          gap: "16px",
        }}
      >
        {cats.map((cat, index) => (
          <img key={index} src={cat?.url} alt="" className="h-72 w-72 rounded-md" />
        ))}
      </div>
    </div>
  );
}

export default App;
