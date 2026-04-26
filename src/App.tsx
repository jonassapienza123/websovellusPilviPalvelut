import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import LoginForm from "./LoginForm";
import { auth } from "./firebase";
import { logout } from "./authService";
import "./App.css";
import { QuizForm } from "./components/QuizForm";
import { createSession, listenToSession } from "./gameSessionService";
import { submitGuess as submitGuessToGame } from "./gameController";
import type { Session } from "./types/Session";
import { joinSession } from "./gameSessionService";

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
  const [session, setSession] = useState<Session | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const name = getOrCreateCodename(firebaseUser.uid);
        setCodename(name);

      // 🔥 Hardkoodattu session ID (kaikki liittyvät samaan peliin)
const SESSION_ID = "demo-session";

// yritetään hakea olemassa oleva session
let existingSession = null;

try {
  const { getSession } = await import("./gameSessionService");
  existingSession = await getSession(SESSION_ID);
} catch {}

if (!existingSession) {
  const newSession = await createSession({
    name: "Yhteinen peli",
    creatorUid: firebaseUser.uid,
    creatorName: name,
  });

  setSession(newSession);
  setSessionId(newSession.id);
} else {
  setSession(existingSession);
  setSessionId(existingSession.id);
}

// liity peliin
await joinSession(
  existingSession ?? session!,
  {
    uid: firebaseUser.uid,
    codename: name,
    score: 0,
    guess: null,
  }
);
      } else {
        setCodename("");
        setSession(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  if (!sessionId) return;

  const unsubscribe = listenToSession(sessionId, (updatedSession) => {
    setSession(updatedSession);
  });

  return () => unsubscribe();
}, [sessionId]);

  async function submitGuess(guess: number) {
    if (!session || !user) return;

    try {
      await submitGuessToGame(session, user.uid, guess);
    } catch (error) {
      console.error("Arvauksen lähetys epäonnistui:", error);
    }
  }

  return (
    <div className="app">
      <div className="card">
        {user ? (
          <>
            <h1>Tervetuloa, {codename}</h1>
            <p>Kirjautunut käyttäjä: {user.email}</p>
            <button onClick={logout}>Kirjaudu ulos</button>

            <hr />

            {session ? (
              <QuizForm
                onSubmitGuess={submitGuess}
                players={session.players}
                currentUserId={user.uid}
                productName={session.product?.title}
                correctPrice={
                  session.status === "finished"
                    ? session.correctPrice ?? undefined
                    : undefined
                }
              />
            ) : (
              <p>Luodaan pelisessiota...</p>
            )}
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}

export default App;