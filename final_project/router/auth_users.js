const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}
regd_users.get("/:username",(req,res)=>{
    const username = req.params.username;
    if(Object.hasOwn(users, username)){
     res.send(users[username]);
    }else{
      res.send (users);
        // return res.status(404).json({message: "User not found"});
    }
});

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if(req.session.authorization){
        res.send (req.session.authorization['accessToken']);
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    console.log ('accesToken',accessToken);
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(408).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.params.review;
	const username = req.user.username;
    if(Object.hasOwn(books, isbn)){
        const book = books[isbn]; 
	    if(Object.hasOwn(book.reviews, username)){
			book.reviews[username].review = review;
			return res.status(201).json({message: "Review modified successfully!"});		
		}else{
			book.reviews[username] = {
				username: username,
				review: review
			};
			return res.status(200).json({message: "Review added successfully!"});
		}	
    }else{
        return res.status(400).json({message: "Book not found!"});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
	const username = req.user.username;
	
	if(Object.hasOwn(books, isbn)){
		const book = books[isbn];
		if(Object.hasOwn(book.reviews, username)){
                book.reviews['username'] = {
                    username: "",
                    review: ""
                };
			res.send(`Review has been deleted.`); 
		}else{
			return res.status(404).json({message: "Review not found!"});
		}
	}else{
		return res.status(404).json({message: "Book not found!"});
	}		
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
