import React from "react"
import { useHistory } from "react-router-dom"
import queryString from "query-string"


const GameContainer = () => {
  const history = useHistory()
  const queryMap = queryString.parse(history.location.search)
  const ws = new WebSocket(queryMap.serverUrl)

  
  // attempt to join the game
  ws.onopen = () => ws.send(JSON.stringify({ messageType: "joinRoom", roomId: queryMap.roomId }))

  return <></>
}

export default GameContainer;