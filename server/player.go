package main

import (
	"fmt"
	"gomr-server/uuid"

	"github.com/gorilla/websocket"
)

type Player struct {
	Id    string `json:"playerId"`
	Color string `json:"color"`
	conn  *websocket.Conn
}

func NewPlayer(conn *websocket.Conn, color string) *Player {
	return &Player{
		Id:    uuid.NewDashless(),
		Color: color,
		conn:  conn,
	}
}

func (p *Player) send(message interface{}) error {
	if p.conn == nil {
		return fmt.Errorf("Websocket connection was nil")
	}

	return p.conn.WriteJSON(message)
}
