package main

import (
	"fmt"
	"gomr-server/uuid"

	"github.com/gorilla/websocket"
)

type Room struct {
	Id          string  `json:"roomId"`
	Player1     *Player `json:"player1"`
	Player2     *Player `json:"player2"`
	BoardState  string  `json:"boardState"`
	CurrentTurn string  `json:"currentTurn"`
}

// New creates a new empty Room
func NewRoom(boardState string) *Room {
	player1 := NewPlayer(nil, "B")
	player2 := NewPlayer(nil, "W")

	return &Room{
		Id:          uuid.NewDashless(),
		Player1:     player1,
		Player2:     player2,
		BoardState:  boardState,
		CurrentTurn: player1.Id,
	}
}

func (r *Room) JoinPlayer(playerId string, conn *websocket.Conn) error {
	if playerId == r.Player1.Id {
		r.Player1.conn = conn
		return nil
	} else if playerId == r.Player2.Id {
		r.Player2.conn = conn
		return nil
	} else {
		return fmt.Errorf("Invalid playerId [%s] for room %s", playerId, r.Id)
	}
}
