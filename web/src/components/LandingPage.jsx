import React from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { config } from "../config"
import "./LandingPage.css"

const LandingPage = () => {
  const history = useHistory()

  const fetchGame = () => {
    axios
      .post(config.serverUrl + "/game")
      .then((success) => {
        console.log(success)
        history.push(`/game/${success.data.roomId}`)
      })
      .catch((err) => {
        console.log("could not create new game: " + err)
      })
  }

  return (
    <main>
      <h1>Welcome to GOMR</h1>
      <button onClick={fetchGame}>Play Game!</button>
    </main>
  )
}

export default LandingPage
