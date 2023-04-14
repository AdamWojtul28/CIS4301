package main

import (
	"log"
	"net/http"
)

func main() {
	Connect()
	Migrate()

	// host the server... keep this last
	host := "127.0.0.1:5000"
	if err := http.ListenAndServe(host, httpHandler()); err != nil {
		log.Fatalf("Failed to listen on %s: %v", host, err)
	}
}
