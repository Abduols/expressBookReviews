/** @format */

const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	//Write your code here
	const { username, password } = req.body;

	if (!username && !password) {
		return res
			.status(400)
			.json({ message: "Username and password are required" });
	}
	if (!username) {
		return res.status(400).json({ message: "Username is required" });
	}
	if (!password) {
		return res.status(400).json({ message: "Password is required" });
	}

	const userExists = users.find((user) => user.username === username);
	if (userExists) {
		return res.status(409).json({ message: "Username already exists" });
	}

	users.push({ username, password });
	return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	//Write your code here
	return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	//Write your code here
	const isbn = req.params.isbn;

	return res.status(300).json(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	//Write your code here
	const author = req.params.author;
	const bookKeys = Object.keys(books);
	const matchingBooks = [];

	bookKeys.forEach((key) => {
		if (books[key].author === author) {
			matchingBooks.push(books[key]);
		}
	});
	return res.status(300).json(matchingBooks);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	//Write your code here
	const title = req.params.title;
	const bookKeys = Object.keys(books);
	const matchingBooks = [];

	bookKeys.forEach((key) => {
		if (books[key].title === title) {
			matchingBooks.push(books[key]);
		}
	});

	return res.status(200).json(matchingBooks);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	//Write your code here
	const isbn = req.params.isbn;
	return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
