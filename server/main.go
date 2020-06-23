package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/gorilla/websocket"
)

var port = flag.String("port", "8080", "port to listen on")

func main() {
	flag.Parse()
	store := NewStore()

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	router.Get("/game/{roomId}", getGame(store))
	router.Post("/game", createGame(store))
	router.Post("/game/join", joinGame(store))
	router.HandleFunc("/gomr", ws(store))

	addr := fmt.Sprintf("0.0.0.0:%s", *port)
	log.Println("Server up on", addr)
	http.ListenAndServe(addr, router)
}

func getGame(store Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// roomId := strings.TrimPrefix(r.URL.Path, "/game/")
		roomId := chi.URLParam(r, "roomId")

		if roomId == "" {
			w.WriteHeader(404)
			return
		}

		room, err := store.GetRoom(roomId)
		if err != nil {
			w.WriteHeader(404)
			log.Println("Error fetching room:", roomId, err)
			return
		}

		json.NewEncoder(w).Encode(room)
	}
}

func createGame(store Store) http.HandlerFunc {
	type response struct {
		RoomId  string `json:"roomId"`
		Player1 string `json:"player1"`
		Player2 string `json:"player2"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		// TODO accept size on request
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

// TODO upgrade connection here?
func joinGame(store Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

// WS comm
type wsRequest struct {
	MessageType string `json:"messageType"`
	RoomId      string `json:"roomId"`
	boardState  string `json:"boardState"`
}

type wsError struct {
	MessageType string `json:"messageType"`
	Error       string `json:"error"`
}

func writeError(conn *websocket.Conn, message string) {
	msg := wsError{
		MessageType: "error",
		Error:       message,
	}

	err := conn.WriteJSON(msg)
	if err != nil {
		// TODO what can we do with this?
		log.Println("write:", err)
	}
}

var upgrader = websocket.Upgrader{
	// TODO cors
	CheckOrigin: func(r *http.Request) bool { return true },
}

func ws(store Store) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("ws upgrade failed: ", err)
			return
		}
		defer conn.Close()

		// Main ws loop
		for {
			var req wsRequest
			err := conn.ReadJSON(&req)
			if err != nil {
				log.Println("ws read: ", err)
				break
			}

			switch req.MessageType {
			case "joinRoom":
				type joinResponse struct {
					MessageType string `json:"messageType"`
					PlayerId    string `json:"playerId"`
					Color       string `json:"color"`
					BoardState  string `json:"boardState"`
				}

				room, err := store.GetRoom(req.RoomId)
				if err != nil {
					writeError(conn, "Invalid room")
					return
				}

				resp := joinResponse{
					MessageType: "joined",
					PlayerId:    room.Player1.Id,
					Color:       room.Player2.Id,
					BoardState:  room.BoardState,
				}

				if room.Player1.conn == nil {
					room.JoinPlayer(room.Player1.Id, conn)
					resp.PlayerId = room.Player1.Id
					resp.Color = room.Player1.Color
				} else if room.Player2.conn == nil {
					room.JoinPlayer(room.Player1.Id, conn)
					resp.PlayerId = room.Player2.Id
					resp.Color = room.Player2.Color
				} else {
					// TODO spectating logic
					resp.PlayerId = "spectator"
					resp.Color = "-"
				}

				conn.WriteJSON(resp)

			case "play":
				_, err := store.GetRoom(req.RoomId)
				if err != nil {
					writeError(conn, "Invalid room")
					return
				}

			default:
				log.Println("Unknown message received:", req.MessageType)
				writeError(conn, "Invalid message")
			}
		}

	}
}
