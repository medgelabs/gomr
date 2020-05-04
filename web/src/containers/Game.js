import React from "react"
import { useHistory } from "react-router-dom"
import queryString from "query-string"


const GameContainer = () => {
  const history = useHistory()
  const queryMap = queryString.parse(history.location.search)
  const ws = new WebSocket(queryMap.serverUrl)

  var gameStart = false;

  
  // attempt to join the game
  ws.onopen = () => ws.send(JSON.stringify({ messageType: "joinRoom", roomId: queryMap.roomId }))
  ws.onmessage () => 

  return <>

  </>
}

export default GameContainer;