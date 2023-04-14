package main

import (
	"log"

	oracle "github.com/godoes/gorm-oracle"

	"gorm.io/gorm"
)

type User struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

var Instance *gorm.DB
var err error

func Connect() {
	url := oracle.BuildUrl("oracle.cise.ufl.edu", 1521, "orcl", "username", "password", nil)
	Instance, err = gorm.Open(oracle.Open(url), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
		panic("Cannot connect to DB")
	}
	log.Println("Connected to Database...")
}

func Migrate() {
	Instance.AutoMigrate(&User{})
	log.Println("Database Migration Completed...")
}
