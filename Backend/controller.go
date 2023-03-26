package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

// ** CREATE USER ** //
func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user User
	json.NewDecoder(r.Body).Decode(&user)
	// send information to the database (success)
	Instance.Create(&user)
	w.WriteHeader(202)
	// Code for 'Accepted' when unique username
	json.NewEncoder(w).Encode(user)
}

func GetUserById(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["id"]
	var user User
	Instance.First(&user, userId)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	var users []User
	Instance.Raw("SELECT * FROM USERS").Scan(&users)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

// ** UPDATE FUNCTION ** //
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["id"]
	var user User
	Instance.First(&user, userId)
	json.NewDecoder(r.Body).Decode(&user)
	Instance.Save(&user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// ** DELETE FUNCTION ** //
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId := mux.Vars(r)["id"]
	var user User
	Instance.Delete(&user, userId)
	json.NewEncoder(w).Encode("User Deleted Successfully!")
}
