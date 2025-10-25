//this is the server file from the backend which handles the request and responses

import express from "express";//here we are using this import syntax as we have said ES6 to treat out files as modules in the package.json
app.use(express.json()); //the express is a server and this makes express able to read the json req 

import bcrypt from 'bcrypt';
import mysql from "mysql2/promise";//for database setup

const pool = mysql.createPool({
  host: 'localhost',       // Or '127.0.0.1'
  user: 'root', // Often 'root' on a local machine
  password: 'password', // The password you set for MySQL
  database: 'project_db'     // <-- THIS IS THE DATABASE NAME YOU CREATED
});


try {
  const connection = await pool.getConnection();
  console.log('Successfully connected to the database!');
  connection.release(); // Don't forget to release the connection
} catch (error) {
  console.error('Error connecting to the database:', error);
}

//this is a register route for user registration
app.post('/api/register', async (req, res) => {
  try {
    // 1. Get data from the request body
    const { username, email, password } = req.body;

    // 2. Check if user already exists
    const [existingUser] = await pool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).send('Error: Email already in use.');
    }

    // 3. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Insert the new user into the database
    await pool.query(
      'INSERT INTO Users (username, email, pass, created_at) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, new Date()]
    );

    // 5. Send a success response
    res.status(201).send('User registered successfully!');

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Error: Server error during registration.');
  }
});

//creating a login endpoint
app.post('/api/login', async (req, res) => {
  try {
    // 1. Get data from the request body
    const { email, password } = req.body;

    // 2. Check if user already exists
    const [existingUser] = await pool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).send('Error: Email already in use.');
    }

    // 3. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Insert the new user into the database
    await pool.query(
      'INSERT INTO Users (username, email, pass, created_at) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, new Date()]
    );

    // 5. Send a success response
    res.status(201).send('User registered successfully!');

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Error: Server error during registration.');
  }
});


