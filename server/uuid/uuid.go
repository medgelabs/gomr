package uuid

import (
	"strings"

	guid "github.com/google/uuid"
)

// NewDashless returns a UUID stripped of dashes
func NewDashless() string {
	return strings.ReplaceAll(guid.New().String(), "-", "")
}
