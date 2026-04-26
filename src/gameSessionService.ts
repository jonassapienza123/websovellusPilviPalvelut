import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Session } from "./types/Session";
import type { Player } from "./types/Player";
import { fetchRandomProduct } from "./productService";

type CreateSessionInput = {
  name: string;
  creatorUid: string;
  creatorName: string;
};

export async function createSession({
  name,
  creatorUid,
  creatorName,
}: CreateSessionInput): Promise<Session> {
  const product = await fetchRandomProduct();

  const creator: Player = {
    uid: creatorUid,
    codename: creatorName,
    score: 0,
    guess: null,
  };

  const sessionData = {
    sessionName: name,
    status: "waiting",
    players: [creator],
    currentRound: 1,
    product,
    correctPrice: product.price,
    winner: null,
    createdAt: Date.now(),
    createdBy: creatorUid,
  };

  const docRef = await addDoc(collection(db, "sessions"), sessionData);

  return {
    id: docRef.id,
    ...sessionData,
  } as Session;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const docRef = doc(db, "sessions", sessionId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Session;
}

export function listenToSession(
  sessionId: string,
  callback: (session: Session | null) => void
) {
  const docRef = doc(db, "sessions", sessionId);

  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback({
      id: snapshot.id,
      ...snapshot.data(),
    } as Session);
  });
}

export async function joinSession(
  session: Session,
  player: Player
): Promise<void> {
  const alreadyJoined = session.players.some((p) => p.uid === player.uid);

  if (alreadyJoined) {
    return;
  }

  const updatedPlayers = [...session.players, player];

  const newStatus =
    updatedPlayers.length >= 2 && session.status === "waiting"
      ? "playing"
      : session.status;

  await updateDoc(doc(db, "sessions", session.id), {
    players: updatedPlayers,
    status: newStatus,
  });
}

export async function updateSession(session: Session): Promise<void> {
  await updateDoc(doc(db, "sessions", session.id), {
    sessionName: session.sessionName,
    status: session.status,
    players: session.players,
    currentRound: session.currentRound,
    product: session.product,
    correctPrice: session.correctPrice,
    winner: session.winner,
    createdAt: session.createdAt,
    createdBy: session.createdBy,
  });
}