import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import LoginForm from "./LoginForm";
import { auth, logout } from "./authService";
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

function getOrCreateCodename(uid: string): string {
  const storageKey = `codename_${uid}`;
  const existingCodename = localStorage.getItem(storageKey);

  if (existingCodename) {
    return existingCodename;
  }

  const newCodename = generateCodename();
  localStorage.setItem(storageKey, newCodename);
  return newCodename;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [codename, setCodename] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const name = getOrCreateCodename(firebaseUser.uid);
        setCodename(name);
      } else {
        setCodename("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      <div className="card">
        {user ? (
          <>
            <h1>Tervetuloa, {codename}</h1>
            <p>Kirjautunut käyttäjä: {user.email}</p>
            <button onClick={logout}>Kirjaudu ulos</button>
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}

export default App;