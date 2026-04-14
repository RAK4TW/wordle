import { useState, useRef, useEffect } from "react";
import styles from "./Wordle.module.css";
import { setup } from "../data/setup";
import { words } from "../data/words";

const word = words[Math.floor(Math.random() * (words.length - 1 + 1)) + 1];

export function Wordle() {
  const input = useRef<HTMLInputElement | null>(null);
  const secret = word;
  const [tries, setTries] = useState(0);
  const [success, setSuccess] = useState<null | Boolean>(null);
  const [guesses, setGuesses] = useState(setup);


  function handleReset(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setSuccess(null);
    setGuesses(setup);
    setTries(0);
  }

  function handleMissed() {
    setSuccess(false);
    setGuesses(setup);
    setTries(0);
  }

  useEffect(() => {
    if (tries === 5 && !success) handleMissed();
  }, [tries])

  function handleGuess() {
    const guess = input.current?.value.toString();
    if (!guess) return;
    if (tries >= 5 || success ) return;
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

    if (guess === secret) setSuccess(true);
  }

  return (
    <div>
      <h1>Wordle</h1>
      <h2>{success === true ? `You Won! It was "${secret}"` : success === false ? 'Sorry! Try again!' : ''}</h2>
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
          disabled={success === false ? true : false}
        />


        {(success == true || success == false) ? (
          <button className={styles.guessReset} type="button" onClick={(e) => handleReset(e) }>Reset</button>
        ) : (
          <button className={styles.guessSubmit} type="submit">
            Submit
          </button>
        )}
      </form>
    </div>
  );
}
