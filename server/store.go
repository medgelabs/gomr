package main

import (
	"fmt"
)

// Store for Rooms
type Store interface {
	AddRoom(Room) error
	GetRoom(string) (Room, error)
	RemoveRoom(string)
}

// Store using in-memory map
type MapStore struct {
	rooms map[string]Room
}

func NewStore() *MapStore {
	return &MapStore{
		rooms: make(map[string]Room),
	}
}

func (s MapStore) AddRoom(room Room) error {
	s.rooms[room.Id] = room
	return nil
}

func (s MapStore) GetRoom(roomId string) (Room, error) {
	r, ok := s.rooms[roomId]
	if !ok {
		return Room{}, fmt.Errorf("Room %s not found", roomId)
	}

	return r, nil
}

func (s MapStore) RemoveRoom(roomId string) {
	delete(s.rooms, roomId)
}
