import React from "react"
import Header from "./components/Header"
import { languages } from "./languages"
import { clsx } from "clsx"
import {getFarewellText , getRandomWord} from "./utils"
export default function App(){
    // State veriables 
    const [currentWord,setCurrentWord] = React.useState( getRandomWord())
    const [holdkeys,setHoldKeys] = React.useState([])
    // Drived veriables 
    const wrongGuessCount = holdkeys.filter(letter => !currentWord.includes(letter)).length
    const isGameWon = currentWord.split("").every(letter => holdkeys.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length-1 
    const isGameOver = isGameWon || isGameLost
    const incorrectGuess = wrongGuessCount && !currentWord.includes(holdkeys[holdkeys.length -1])
    // keys
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    // functions 
    const languagesArr = languages.map((language,index) =>{ 
        const lostLanguages = wrongGuessCount > index
        const styles = {
            backgroundColor:language.backgroundColor,
            color:language.color
        }
        return (
            <div style={styles} key={language.name} className={clsx("languagesDiv", {
                "lost": lostLanguages
            })}>
                  {language.name}
             </div>
       
    )
    })
    const lettersArr = currentWord.split("")

    const wordsArr = lettersArr.map((word,index) => {
        const guess = isGameLost || holdkeys.includes(word)
        const className = clsx({
            "missedLetter" : isGameLost && !holdkeys.includes(word)
        })
      
            return (
                <span key={index} className={className}>{guess? word.toUpperCase() : ""}</span>
            )
    })

    const keysArr = alphabet.split("")

    const keyboardKeys = keysArr.map((key) => {
        const guessedLetter = holdkeys.includes(key);
        const isCorrect = guessedLetter && currentWord.includes(key);
        const wrong = guessedLetter && !currentWord.includes(key);
        const className = clsx({
            correct: isCorrect,
            wrong: wrong,
        })
        
        return (
            <button
                disabled={isGameOver}
                className={className}
                key={key}
                onClick={() => handleClick(key)}
            >
                {key.toUpperCase()}
            </button>
        )
    })
    

    function handleClick(key){
      setHoldKeys(prevkeys => {
            return prevkeys.includes(key) ? prevkeys : [...prevkeys,key]
      })
    
        
    }

    function gameStatus(){
        if(!isGameOver){
            if(incorrectGuess){
              
                    return getFarewellText(languages[wrongGuessCount -1].name)
            }else{
                return null
            }
        }else if(isGameWon){
            return (
                <> 
                   <h2>You win🎉</h2>
                   <p> Well done</p> 
                </>
            )
        }else{
            return(
            <> 
              <h2>Game Over!</h2>
              <p>You lose Better start Learnning Assembly</p>
             </>
            )
        }
    }

    const className = clsx("game-status", {
        "win" : isGameWon,
        "gameLost" : isGameLost,
        "farewellText" : !isGameOver && incorrectGuess
    })


    function newGame(){
        setCurrentWord(getRandomWord())
        setHoldKeys([])

    }


    return(
       <main>
            <Header />
            <section className={className}>
                  {gameStatus()}  
            </section>
           <section className="languages">
                 {languagesArr}
           </section>

           <section className="words-section">
                {wordsArr}
           </section>

           <section className="keyboard-section">
                {keyboardKeys}
           </section>
           <footer>
                {isGameOver && <button onClick={newGame}>New Game</button>}
           </footer>
       </main>
    )
}