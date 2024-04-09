const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Task 6 : Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1 & 10 : Get the book list available in the shop
public_users.get('/', async function (req, res) {
  res.send(JSON.stringify(books,null,10));
});

// Task 2 & 11 : Get book details based on ISBN
public_users.get('/isbn/:isbn', async(req, res)=>{
    const isbn = req.params.isbn;
    await new Promise((resolve,reject)=>{
		let booklist = {};
		try{
			if(Object.hasOwn(books, isbn)){
				booklist = books[isbn];
			}       
		   resolve(booklist);
	    } catch(err) {
			reject(err);
		}
	 }).then(
			(booklist) => res.send(booklist),
			(err) => {return res.status(404).json({message: "Book not found!"})}
	);
 });
  
//Task 3 & 12 : Get book details based on author
public_users.get('/author/:author',(req, res)=>{
    const author = req.params.author;
    new Promise((resolve,reject)=>{
		let filtered_book = {};
		try{
			for (const book of Object.values(books)){
				if(book.author === author){
					 filtered_book = book;
				}       
			}
		   resolve(filtered_book);
	    } catch(err) {
			reject(err);
		}
	 }).then(
			(filtered_book) => res.send(filtered_book),
			(err) => {return res.status(404).json({message: "Book not found!"})}
	);
});

// Task 4 & 13 : Get all books based on title
public_users.get('/title/:title',async (req, res)=>{
    const title = req.params.title;
    await new Promise((resolve,reject)=>{
		let filtered_book = {};
		try{
			for (const book of Object.values(books)){
				if(book.title === title){
					 filtered_book = book;
				}       
			}
		   resolve(filtered_book);
	    } catch(err) {
			reject(err);
		}
	 }).then(
			(filtered_book) => res.send(filtered_book),
			(err) => {return res.status(404).json({message: "Book not found!"})}
	);
});

// Task 5 : Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let booklist = books[isbn];
    if(booklist){        
       res.send(booklist['review']);
    }else{
        return res.status(400).json({message: "Book review not found!"});
    }
});


module.exports.general = public_users;
