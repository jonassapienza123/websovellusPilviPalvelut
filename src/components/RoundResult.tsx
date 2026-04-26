import type { Player } from "../types/Player";

export function RoundResult({
  players,
  correctPrice,
}: {
  players: Player[];
  correctPrice: number;
}) {
  const winner = players.reduce((bestPlayer, currentPlayer) => {
    const bestDifference = Math.abs((bestPlayer.guess ?? 0) - correctPrice);
    const currentDifference = Math.abs((currentPlayer.guess ?? 0) - correctPrice);

    return currentDifference < bestDifference ? currentPlayer : bestPlayer;
  });

  return (
    <div>
      <h3>Kierroksen tulos</h3>

      <p>Oikea hinta: {correctPrice} €</p>
      <p>Voittaja: {winner.codename}</p>

      <ul>
        {players.map((p) => (
          <li key={p.uid}>
            {p.codename}: {p.guess ?? "-"} €
            {p.guess !== null && (
              <> (ero {Math.abs(p.guess - correctPrice)} €)</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}