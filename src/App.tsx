import { useState } from "react";
import "./App.css";

function generateCodename(): string {
  const adjectives = [
    "Sneaky",
    "Cosmic",
    "Shadow",
    "Rapid",
    "Mighty",
    "Silent",
    "Lucky",
    "Glowing",
    "Clever",
    "Brave",
  ];

  const animals = [
    "Panda",
    "Fox",
    "Tiger",
    "Otter",
    "Falcon",
    "Wolf",
    "Koala",
    "Shark",
    "Hawk",
    "Lynx",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomNumber = Math.floor(Math.random() * 100);

  return `${randomAdjective}${randomAnimal}${randomNumber}`;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [codename, setCodename] = useState("");

  const handleLogin = () => {
    let savedCodename = localStorage.getItem("codename");

    if (!savedCodename) {
      savedCodename = generateCodename();
      localStorage.setItem("codename", savedCodename);
    }

    setCodename(savedCodename);
    setIsLoggedIn(true);
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Koodinimisovellus</h1>

        {!isLoggedIn ? (
          <>
            <p>Paina nappia kirjautuaksesi sisään.</p>
            <button onClick={handleLogin}>Kirjaudu sisään</button>
          </>
        ) : (
          <>
            <p>Olet kirjautunut sisään.</p>
            <h2>Koodinimesi on:</h2>
            <div className="codename">{codename}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;