/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src];

  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }

  if (typeof src === 'string') {
    return copy.join('');
  }

  return copy;
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const WORDS = [
  "REACT",
  "JAVASCRIPT",
  "CSS",
  "HTML",
  "NODE",
  "VITE",
  "ANGULAR",
  "VUE",
  "WEBPACK",
  "BABEL",
  "GITHUB",
];

const ScrambleGame = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [currentWord, setCurrentWord] = React.useState("");
  const [scrambledWord, setScrambledWord] = React.useState("");
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [passes, setPasses] = React.useState(3);
  const [gameWords, setGameWords] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [isGameEnded, setIsGameEnded] = React.useState(false);

  React.useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("scrambleGame"));
    if (savedData) {
      setIsPlaying(savedData.isPlaying);
      setInputValue(savedData.inputValue);
      setCurrentWord(savedData.currentWord);
      setScrambledWord(savedData.scrambledWord);
      setPoints(savedData.points);
      setStrikes(savedData.strikes);
      setPasses(savedData.passes);
      setGameWords(savedData.gameWords);
      setMessage(savedData.message);
    }
  }, []);

  React.useEffect(() => {
    if (isPlaying) {
      localStorage.setItem("scrambleGame", JSON.stringify({
        isPlaying,
        inputValue,
        currentWord,
        scrambledWord,
        points,
        strikes,
        passes,
        gameWords,
        message,
      }));
    } else {
      localStorage.removeItem("scrambleGame");
    }
  }, [isPlaying, inputValue, currentWord, scrambledWord, points, strikes, passes, gameWords, message]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value.toUpperCase());
  };

  const selectWord = () => {
    const remainingWords = WORDS.filter(word => !gameWords.includes(word));
    if (remainingWords.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    return remainingWords[randomIndex];
  };

  const startGame = () => {
    resetGame();
    const word = selectWord();
    if (!word) {
      return;
    }
    setCurrentWord(word.toUpperCase());
    setScrambledWord(shuffle(word.toUpperCase()));
    setIsPlaying(true);
    setInputValue("");
    setMessage("");
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setGameWords([word.toUpperCase()]);
    setIsGameEnded(false);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setInputValue("");
    setCurrentWord("");
    setScrambledWord("");
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setGameWords([]);
    setMessage("");
    localStorage.removeItem("scrambleGame");
    setIsGameEnded(false);
  };

  const handleGuess = () => {
    if (inputValue === currentWord) {
      setPoints(points + 1);
      const newWord = selectWord();
      if (newWord === null) {
        handleEndGame();
        return;
      }
      setCurrentWord(newWord.toUpperCase());
      setScrambledWord(shuffle(newWord.toUpperCase()));
      setGameWords([...gameWords, newWord.toUpperCase()]);
      setMessage("Correct! New word generated.");
    } else {
      setStrikes(strikes + 1);
      setMessage("Incorrect! Try again.");
    }
    setInputValue("");
  };

  const handlePass = () => {
    if (passes > 0) {
      const newWord = selectWord();
      if (newWord === null) {
        handleEndGame();
        return;
      }
      setCurrentWord(newWord.toUpperCase());
      setScrambledWord(shuffle(newWord.toUpperCase()));
      setGameWords([...gameWords, newWord.toUpperCase()]);
      setPasses(passes - 1);
      setMessage("Word passed! New word generated.");
    }
  };

  const handleEndGame = () => {
    setIsPlaying(false);
    setIsGameEnded(true);
    setMessage(`Game over! You scored ${points} points.`);
    localStorage.removeItem("scrambleGame");
  };

  React.useEffect(() => {
    if (gameWords.length === WORDS.length || strikes === 3) {
      handleEndGame();
    }
  }, [gameWords, strikes]);

  return (
    <div className="scramble-game">
      <img src="logo.png" alt="Game Logo" className="game-logo" />
      <h1>Scramble Game</h1>
      {isPlaying ? (
        <>
          <div className="game-stats">
            <div className="stat points">Points {points}</div>
            <div className="stat strikes">Strikes {strikes}/3</div>
            <div className="stat passes">Passes {passes}</div>
          </div>
          <div className="scrambled-word">{scrambledWord}</div>
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button onClick={handleGuess}>Enter</button>
            <button onClick={handlePass}>Pass</button>
          </div>
          {message && <p className="message">{message}</p>}
        </>
      ) : (
        <>
          {isGameEnded ? (
            <>
              <p className="message">{message}</p>
              <button onClick={resetGame} className="reset-game-button">Reset Game</button>
            </>
          ) : (
            <button onClick={startGame} className="start-game-button">Start Game</button>
          )}
        </>
      )}
  </div>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<ScrambleGame />);
