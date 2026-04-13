import { useState, useRef } from "react";
import styles from "./Wordle.module.css";
import { setup } from "../data/setup";

export function Wordle() {
  const input = useRef<HTMLInputElement | null>(null);
  const secret = "ocean";
  const [tries, setTries] = useState(0);
  const [success, setSuccess] = useState(false);
  const [guesses, setGuesses] = useState(setup);

  function handleGuess() {

    if (tries >= 5 || success) return;
    
    const guess = input.current?.value.toString();
    if (guess === secret) setSuccess(true);
    
    const newTry = tries + 1;
    setTries(newTry);

    const secretArray = secret?.split("");
    const guessArray = guess?.split("");
    let correctGuesses: string[] = [];
    let orderedGuess: string[] = [];

    guessArray?.forEach((letter) => {
      if (secretArray.includes(letter) && !correctGuesses.includes(letter)) {
        correctGuesses.push(letter);
      }
    });

    secretArray.forEach((letter) => {
      if (correctGuesses.includes(letter)) orderedGuess.push(letter);
      else orderedGuess.push("?");
    });

    setGuesses((previousState) => {
      return { ...previousState, [newTry]: orderedGuess };
    });
  }

  return (
    <div>
      <h1>Wordle</h1>
      {success && <h2>You Won! It was "{secret}"</h2>}
      <div className={styles.wordle}>
        {Object.values(guesses).map((guess) => {
          return (
            <>
              {guess.map((letter) => (
                <div
                  key={`letter-${Math.random() * 10}`}
                  className={`${styles.box} ${letter !== "?" && letter !== "" ? styles.correct : letter == "?" ? styles.false : ""}`}
                >
                  {letter}
                </div>
              ))}
            </>
          );
        })}
      </div>
      <form action={handleGuess}>
        <input
          className={styles.guessInput}
          ref={input}
          type="text"
          maxLength={5}
        />
        <button className={styles.guessSubmit} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
