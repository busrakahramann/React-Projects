package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"golang.org/x/crypto/bcrypt"

	"github.com/gorilla/mux"
)

//User Struct (MOdel)
type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

//Post Struct (MOdel)
type Post struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Title     string    `json:"title"`
	Image     string    `json:"image"`
	Story     string    `json:"story"`
	Create_at time.Time `json:"create_at"`
	Update_at time.Time `json:"update_at"`
	UserId    string    `json:"user_id"`
}
type LoginUSer struct {
	ID     int    `json:"id"`
	Status bool   `json:"status"`
	Mesaj  string `json:"mesaj"`
}

//Init books var as a slice Book struct
var users []User
var posts []Post
var db *sql.DB

func CryptoPassword(p, h string) (string, error) {
	password := []byte(p)
	if h == "create" {
		hashedPassword, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
		if err != nil {
			return "", err
		}
		return string(hashedPassword), nil
	}
	err := bcrypt.CompareHashAndPassword([]byte(h), password)
	return "", err
}

//LOGIN Apı
func loginPage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-TYpe", "application/json")

	var u User

	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var databaseEmail string
	var databasePassword string
	var databaseId int

	user := &LoginUSer{}

	if err := db.QueryRow("SELECT email, password,id FROM user WHERE email=?", u.Email).Scan(&databaseEmail, &databasePassword, &databaseId); err != nil {
		user.Status = false
		user.Mesaj = "Kullanıcı bulunamadı"
		json.NewEncoder(w).Encode(user)
		return
	}

	if _, err := CryptoPassword(u.Password, databasePassword); err != nil {
		user.Status = false
		user.Mesaj = "Şifre hatalı"
		json.NewEncoder(w).Encode(user)
		return

	}

	user.ID = databaseId
	user.Status = true
	user.Mesaj = "Giriş başarılı"
	json.NewEncoder(w).Encode(user)
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-TYpe", "application/json")
	var id, username, email, password string
	var users []User
	rows, _ := db.Query("SELECT * from user")

	for rows.Next() {
		err := rows.Scan(&id, &username, &email, &password)
		if err != nil { /* error handling */
			log.Println(err)
		}

		users = append(users, User{ID: id, Username: username, Password: password})
	}

	json.NewEncoder(w).Encode(users)

}

//get single user
func getUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-TYpe", "application/json")
	params := mux.Vars(r)
	result, err := db.Query("SELECT * FROM user WHERE id = ?", params["id"])
	if err != nil {
		panic(err.Error())
	}

	var users User
	var id, username, email, password string
	password, err = CryptoPassword(users.Password, "create")
	if err != nil {
		panic(err.Error())
	}

	for result.Next() {
		err = result.Scan(&id, &username, &email, &password)

		users = User{ID: id, Username: username, Email: email, Password: password}
	}

	if err != nil {
		panic(err.Error())
	}

	json.NewEncoder(w).Encode(users)
}

//create new users
func createUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	var user User
	_ = json.NewDecoder(r.Body).Decode(&user)
	user.ID = strconv.Itoa(len(users) + 1)
	users = append(users, user)
	json.NewEncoder(w).Encode(user)
	stmt, err := db.Prepare("insert into user(username,email,password) values(?,?,?)")
	if err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	password, err := CryptoPassword(user.Password, "create")
	if err != nil {
		panic(err.Error())
	}
	_, er := stmt.Exec(user.Username, user.Email, password)
	if er != nil {
		panic(er.Error())
	}

}

func showPicHandle(w http.ResponseWriter, req *http.Request) {
	params := mux.Vars(req)
	file, err := os.Open("./public/" + params["name"])
	if err != nil {
		panic(err.Error())
	}

	defer file.Close()
	buff, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err.Error())
	}

	w.Write(buff)
}

//update user
func updateUsers(w http.ResponseWriter, r *http.Request) {
	{
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")
		params := mux.Vars(r)
		stmt, err := db.Prepare("UPDATE user SET username=?,email=?,password=? WHERE id = ?")
		if err != nil {
			panic(err.Error())
		}

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			panic(err.Error())
		}
		user := User{}

		json.Unmarshal(body, &user)
		newUsername := user.Username
		newEmail := user.Email
		newPassword := user.Password
		newPassword, err = CryptoPassword(user.Password, "create")
		if err != nil {
			panic(err.Error())
		}
		log.Println("test")
		//newCreate_at := keyVal["create_at"]
		//newUpdate_at := keyVal["update_at"]

		_, err = stmt.Exec(newUsername, newEmail, newPassword, params["id"])
		if err != nil {
			panic(err.Error())
		}
		fmt.Fprintf(w, "Post with ID = %s was updated", params["id"])
	}
}
func deleteUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	stmt, err := db.Prepare("DELETE FROM user WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	_, err = stmt.Exec(params["id"])
	if err != nil {
		panic(err.Error())
	}
	dlt, err := db.Prepare("DELETE FROM posts WHERE userId =? ")
	if err != nil {
		panic(err.Error())
	}
	_, err = dlt.Exec(params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Post with ID = %s was deleted", params["id"])

}

//Get all post
func getPosts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-TYpe", "application/json")
	var id, name, title, image, story, create_at, update_at, userId string
	var posts []Post
	rows, _ := db.Query("SELECT * from posts")

	for rows.Next() {
		err := rows.Scan(&id, &name, &title, &image, &story, &create_at, &update_at, &userId)
		log.Println(userId)

		c, err := time.Parse("2006-01-02 15:04:05", create_at)
		if err != nil { /* error handling */
			log.Println(err)
		}
		d, _ := time.Parse("2006-01-02 15:04:05", update_at)

		if err != nil { /* error handling */
		}
		posts = append(posts, Post{ID: id, Name: name, Title: title, Image: image, Story: story, Create_at: c, Update_at: d, UserId: userId})
	}

	json.NewEncoder(w).Encode(posts)

}

//get single post
func getPost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-TYpe", "application/json")
	params := mux.Vars(r)
	result, err := db.Query("SELECT * FROM posts WHERE id = ?", params["id"])
	if err != nil {
		panic(err.Error())
	}

	var posts Post
	var id, name, title, image, story, create_at, update_at, userId string

	for result.Next() {
		err = result.Scan(&id, &name, &title, &image, &story, &create_at, &update_at, &userId)

		c, err := time.Parse("2006-01-02 15:04:05", create_at)
		if err != nil { /* error handling */
			log.Println(err)
		}
		d, _ := time.Parse("2006-01-02 15:04:05", update_at)

		posts = Post{ID: id, Name: name, Title: title, Image: image, Story: story, Create_at: c, Update_at: d, UserId: userId}
	}

	if err != nil {
		panic(err.Error())
	}

	json.NewEncoder(w).Encode(posts)
}

//create new post
func createPosts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "multipart/form-data")
	var post Post

	fmt.Println("File Upload Endpoint Hit")

	// Parse our multipart form, 10 << 20 specifies a maximum
	// upload of 10 MB files.
	r.ParseMultipartForm(32 << 20)

	file, handler, err := r.FormFile("image")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}
	defer file.Close()

	f, err := os.OpenFile("./public/"+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		panic(err.Error())
	}
	defer f.Close()
	io.Copy(f, file)

	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)
	post.Name = r.FormValue("name")
	post.Title = r.FormValue("title")
	post.Image = fmt.Sprintf("%+v", handler.Filename)
	log.Println(post.Image)
	post.Story = r.FormValue("story")
	post.UserId = r.FormValue("user_id")
	log.Println(r.FormValue("user_id"))

	//post.ID = strconv.Itoa(len(posts) + 1)
	post.Create_at = time.Now()
	post.Update_at = time.Now()
	json.NewEncoder(w).Encode(post)
	stmt, err := db.Prepare("insert into posts(name,title,image,story,create_at,update_at,userId) values(?,?,?,?,?,?,?)")
	if err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}

	_, er := stmt.Exec(post.Name, post.Title, post.Image, post.Story, time.Now(), time.Now(), post.UserId)
	if er != nil {
		panic(er.Error())
	}

}

//update post
func updatePosts(w http.ResponseWriter, r *http.Request) {
	{
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")
		params := mux.Vars(r)
		stmt, err := db.Prepare("UPDATE posts SET name=?,title=?,image=?,story=?,create_at=?,update_at = ? WHERE id = ?")
		if err != nil {
			panic(err.Error())
		}
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			panic(err.Error())
		}
		post := Post{}
		json.Unmarshal(body, &post)
		newName := post.Name
		newTitle := post.Title
		newImage := post.Image
		newStory := post.Story
		log.Println("test")
		//newCreate_at := keyVal["create_at"]
		//newUpdate_at := keyVal["update_at"]

		_, err = stmt.Exec(newName, newTitle, newImage, newStory, time.Now(), time.Now(), params["id"])
		if err != nil {
			panic(err.Error())
		}
		fmt.Fprintf(w, "Post with ID = %s was updated", params["id"])
	}
}
func deletePosts(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	stmt, err := db.Prepare("DELETE FROM posts WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	_, err = stmt.Exec(params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Post with ID = %s was deleted", params["id"])

}

func main() {
	//Init Router
	r := mux.NewRouter()

	//Mock Data-@todo - implement DB
	users = append(users, User{ID: "1", Username: "busrak", Email: "b.kahraman@hotmail.com", Password: "12345"})
	users = append(users, User{ID: "2", Username: "burcu", Email: "b.kahr@hotmail.com", Password: "123456"})
	posts = append(posts, Post{ID: "1", Name: "Büşra", Title: "İstanbul", Image: "fgfg", Story: "lorem", Create_at: time.Now(), Update_at: time.Now()})
	//mysql open
	var err error
	db, err = sql.Open("mysql", "busra:Kahraman1*@tcp(127.0.0.1:3306)/blog")
	if err != nil {
		log.Panic(err)
	}
	db.Begin()
	//Route Handlers/Endpoints

	r.HandleFunc("/api/users", getUsers).Methods("GET")
	r.HandleFunc("/api/login", loginPage).Methods("POST")
	r.HandleFunc("/api/users/{id}", getUser).Methods("GET")
	r.HandleFunc("/api/users", createUsers).Methods("POST")
	r.HandleFunc("/api/users/{id}/update", updateUsers).Methods("POST")
	r.HandleFunc("/api/users/{id}/delete", deleteUsers).Methods("POST")
	r.HandleFunc("/api/posts", getPosts).Methods("GET")
	r.HandleFunc("/api/posts/{id}", getPost).Methods("GET")
	r.HandleFunc("/api/posts", createPosts).Methods("POST")
	r.HandleFunc("/api/posts/{id}/update", updatePosts).Methods("POST")
	r.HandleFunc("/api/posts/{id}/delete", deletePosts).Methods("POST")
	r.HandleFunc("/public/{name}", showPicHandle).Methods("GET")

	log.Fatal(http.ListenAndServe(":9000", r))

}
