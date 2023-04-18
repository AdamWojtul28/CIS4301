package main

import (
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// httpHandler creates the backend HTTP router for queries, types,
// and serving the Angular frontend.
func httpHandler() http.Handler {
	router := mux.NewRouter().StrictSlash(true)
	// Your REST API requests go here
	// each request defines what function will be called for the respective url.
	// each URL can only have one of each get, post, etc .. or it will use the first

	// ** Get Routes ** //
	router.HandleFunc("/api/users", GetUsers).Methods("GET")
	router.HandleFunc("/api/getOptions", AllProductTitles).Methods("GET")
	router.HandleFunc("/api/top25", TopTwentyFive).Methods("GET")
	router.HandleFunc("/api/constants", ConstantDangers).Methods("GET")
	router.HandleFunc("/api/fatal-products", Fatality).Methods("GET")
	router.HandleFunc("/api/summertime-sadness", SummertimeSadness).Methods("GET")
	router.HandleFunc("/api/seasonal-hazards", SeasonalHazards).Methods("GET")
	router.HandleFunc("/api/MDHP-growth", MostDangersHouseProductRog).Methods("GET")
	router.HandleFunc("/api/retreival", TestString).Methods("GET")
	router.HandleFunc("/api/count-total", AllCasesOfProductInjury).Methods("GET")

	// ** Post Routes ** //
	router.HandleFunc("/api/users", CreateUser).Methods("POST")
	router.HandleFunc("/users/sendData", CustomQueryMaker).Methods("POST")
	router.HandleFunc("/api/quiz", Test).Methods("POST")

	// ** Put Routes ** //
	router.HandleFunc("/api/users/{id}", UpdateUser).Methods("PUT")

	// ** Delete Routes ** //
	router.HandleFunc("/api/users/{id}", DeleteUser).Methods("DELETE")

	// WARNING: this route must be the last route defined.
	router.PathPrefix("/").Handler(AngularHandler).Methods("GET")

	/**
	 * We need some headers to be statically prepended to every response.
	 */
	return handlers.LoggingHandler(os.Stdout,
		handlers.CORS(
			handlers.AllowCredentials(),
			handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization",
				"DNT", "Keep-Alive", "User-Agent", "X-Requested-With", "If-Modified-Since",
				"Cache-Control", "Content-Range", "Range"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"http://localhost:8080"}),
			handlers.ExposedHeaders([]string{"DNT", "Keep-Alive", "User-Agent",
				"X-Requested-With", "If-Modified-Since", "Cache-Control",
				"Content-Type", "Content-Range", "Range", "Content-Disposition"}),
			handlers.MaxAge(86400),
		)(router))
}
