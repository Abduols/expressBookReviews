/** @format */

const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
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

// Get the book list available in the shop - using Promise
public_users.get("/", function (req, res) {
	new Promise((resolve, reject) => {
		if (books) {
			resolve(books);
		} else {
			reject("Unable to retrieve books");
		}
	})
		.then((result) => res.status(200).json(result))
		.catch((err) => res.status(500).json({ message: err }));
});

// Get book details based on ISBN - using async/await with Axios
public_users.get("/isbn/:isbn", async function (req, res) {
	const isbn = req.params.isbn;
	try {
		const response = await axios.get(`http://localhost:5000/isbn-base/${isbn}`);
		return res.status(200).json(response.data);
	} catch (err) {
		return res.status(404).json({ message: err.message });
	}
});

// Base ISBN route used internally by Axios
public_users.get("/isbn-base/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	return res.status(200).json(books[isbn]);
});

// Get book details based on author - using Promise
public_users.get("/author/:author", function (req, res) {
	const author = req.params.author;

	new Promise((resolve, reject) => {
		const bookKeys = Object.keys(books);
		const matchingBooks = [];
		bookKeys.forEach((key) => {
			if (books[key].author === author) {
				matchingBooks.push(books[key]);
			}
		});
		if (matchingBooks.length > 0) {
			resolve(matchingBooks);
		} else {
			reject("No books found for this author");
		}
	})
		.then((result) => res.status(200).json(result))
		.catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title - using async/await with Axios
public_users.get("/title/:title", async function (req, res) {
	const title = req.params.title;
	try {
		const response = await axios.get(
			`http://localhost:5000/title-base/${title}`,
		);
		return res.status(200).json(response.data);
	} catch (err) {
		return res.status(404).json({ message: err.message });
	}
});

// Base title route used internally by Axios
public_users.get("/title-base/:title", function (req, res) {
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

// Get book review
public_users.get("/review/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
