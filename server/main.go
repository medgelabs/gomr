package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

func main() {
	store := NewStore()

	router := http.NewServeMux()
	router.HandleFunc("/game/", gameHandler(*store))
	router.HandleFunc("/gomr", ws())

	http.ListenAndServe("0.0.0.0:8080", router)
}

func gameHandler(store Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			createGame(store).ServeHTTP(w, r)
		case "GET":
			roomId := strings.TrimPrefix(r.URL.Path, "/game/")
			room, _ := store.GetRoom(roomId)
			json.NewEncoder(w).Encode(room)
		default:
			w.WriteHeader(405)
		}
	}
}

func createGame(store Store) http.HandlerFunc {
	type response struct {
		RoomId  string `json:"roomId"`
		Player1 string `json:"player1"`
		Player2 string `json:"player2"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		room := NewRoom(strings.Repeat(".", 19*19))
		store.AddRoom(*room)

		resp := response{
			RoomId:  room.Id,
			Player1: room.Player1.Id,
			Player2: room.Player2.Id,
		}

		w.Header().Add("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}

func ws() http.HandlerFunc {
	var upgrader = websocket.Upgrader{}

	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("ws upgrade failed: ", err)
			return
		}
		defer conn.Close()

		// Main ws loop
		for {
			mt, message, err := conn.ReadMessage()
			if err != nil {
				log.Println("read: ", err)
				break
			}

			err = conn.WriteMessage(mt, message)
			err = conn.WriteMessage(websocket.TextMessage, []byte(r.Host))
			if err != nil {
				log.Println("write: ", err)
			}
		}

	}
}
