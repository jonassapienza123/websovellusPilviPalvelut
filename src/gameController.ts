import type { Session } from "./types/Session";
import { updateSession } from "./gameSessionService";

export async function submitGuess(
  session: Session,
  uid: string,
  guess: number
): Promise<void> {
  const updatedPlayers = session.players.map((player) => {
    if (player.uid === uid) {
      return {
        ...player,
        guess,
      };
    }

    return player;
  });

  const allPlayersHaveGuessed = updatedPlayers.every(
    (player) => player.guess !== null
  );

  const updatedSession: Session = {
    ...session,
    players: updatedPlayers,
    status: allPlayersHaveGuessed ? "finished" : session.status,
  };

  if (allPlayersHaveGuessed && session.correctPrice !== null) {
    const winner = updatedPlayers.reduce((closestPlayer, currentPlayer) => {
      const closestDifference = Math.abs(
        (closestPlayer.guess ?? 0) - session.correctPrice!
      );
      const currentDifference = Math.abs(
        (currentPlayer.guess ?? 0) - session.correctPrice!
      );

      return currentDifference < closestDifference
        ? currentPlayer
        : closestPlayer;
    });

    updatedSession.winner = winner.codename;
    updatedSession.players = updatedPlayers.map((player) => {
      const difference = Math.abs((player.guess ?? 0) - session.correctPrice!);

      return {
        ...player,
        score: player.score + Math.max(0, 100 - difference),
      };
    });
  }

  await updateSession(updatedSession);
}