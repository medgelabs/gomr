import React from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useHistory } from "react-router-dom"
import "./LandingPage.css"

const LandingPage = () => {
  const history = useHistory()

  const fetchGame = () => {
    axios
      .post("http://localhost:3000/game")
      .then((success) => {
        console.log(success)
        history.push(`/game?roomId=${success.data.roomId}&serverUrl=${success.data.url}&playerId=player1`)
      })
      .catch((fail) => {
        console.log("could not create new game")
      })
  }

  return (
    <>
      <main>
        <h1>Welcome to GOMR</h1>
        <button onClick={fetchGame}>Play Game!</button>
      </main>
    </>
  )
}

export default LandingPage
