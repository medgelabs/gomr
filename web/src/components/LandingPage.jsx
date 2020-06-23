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

    // fetch(`${config.serverUrl}/game`, {method: 'POST'})
    // .then(resp => resp.json())
    // .then(data => history.push(`/game/${data.roomId}`))
    // .catch(err => console.error("Failed to create new game", err))
  }

  return (
    <main>
      <h1>Welcome to GOMR</h1>

      <section>
        <button onClick={fetchGame}>Create Game</button>
      </section>

      <hr />

      <h3>Join Game</h3>
      <section className="join">
        <input type="text" name="roomId" placeholder="Join Code"></input>
        <button>Join Game</button>
      </section>
    </main>
  )
}

export default LandingPage
