import { useState } from "react";
import type { Player } from "../types/Player";
import { RoundResult } from "./RoundResult";

interface QuizFormProps {
  players: Player[];
  currentUserId: string;
  productName?: string;
  correctPrice?: number;
  onSubmitGuess: (guess: number) => void;
}

export function QuizForm({
  players,
  productName,
  correctPrice,
  onSubmitGuess,
}: QuizFormProps) {
  const [guess, setGuess] = useState("");

  if (correctPrice !== null && correctPrice !== undefined) {
    return (
      <RoundResult players={players} correctPrice={correctPrice} />
    );
  }

  return (
    <>
      <p>Arvattava tuote: {productName ?? "Ladataan..."}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitGuess(Number(guess));
          setGuess("");
        }}
      >
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Arvaa hinta (€)"
          required
        />

        <button>Arvaa hinta</button>
      </form>
    </>
  );
}

export default QuizForm;