package main

import (
	"log"
	"net/http"
)

func main() {
	// Initialize Database
	Connect()
	Migrate()

	// host the server... keep this last
	host := "127.0.0.1:1337"
	if err := http.ListenAndServe(host, httpHandler()); err != nil {
		log.Fatalf("Failed to listen on %s: %v", host, err)
	}
}
