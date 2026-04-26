import type { Player } from "./Player";
import type { Product } from "./Product";

export type SessionStatus = "waiting" | "playing" | "finished";

export type Session = {
  id: string;
  sessionName: string;
  status: SessionStatus;
  players: Player[];
  currentRound: number;
  product: Product | null;
  correctPrice: number | null;
  winner: string | null;
  createdAt: number;
  createdBy: string;
};