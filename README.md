# SongPair - Master Thesis

This project contains the backend part of the Master Thesis

This Repository contains following:

- NodeJS back-end application
- Express implementation of the backend server
- MongoDB database connection via Mongoose dependency
- Passport strategies for user authentification
- Socket.io implementation for chat services

## Usage

Our application is a special social-platform where users can see what music other users are listening to, through a synchronization of our app with **Spotify**.
For this the backend performs following operations:

1. For user **Sign Up**, SongPair performs a redirection to spotify where we request certain roles permissions to spotify through each user, spotify account; and redirects back to Song Pair to continue the registration process, where the user must enter an email and password for future authentications
2. For user **Log In** the backend consults the **users** collection in MongoDB
3. For **near users** mapping, the backend first updates the user's position in the DataBase and afterwards retrieves the location of the other users stored in the DataBase and calculates the distance, and shows the users within a specific range (15km) displaying in the map the song that is being played by that user in spotify.
4. For **chat requests**, the backend checks in the database if there is already a socket created between those 2 users and returns the socket to the backend, and if there is not a preious existing socket, it creates it, stores it in the DataBase and sends the info back to the frontend.
5. For chat **instant messaging** service, there is a socket.io event listener which notifies others users when a message is sent.
   6- For **likes** mapping, it consults in the DataBase if that song of that specific user has already a like given, and gathers the number of likes that song has been received by other users

## Heroku Deployed App

[Song Pair](https://songpair-backend.herokuapp.com/)

## Database

MongoDB database is hosted in Atlas Online server

## Authors

**Guilherme Carra** & **Jaime Botet**

## Repository

[Code Assembler](https://code.assemblerschool.com/guilherme-carra/Songpair-backend-TFM.git)
