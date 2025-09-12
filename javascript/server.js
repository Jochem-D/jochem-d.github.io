import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Endpoint to get a token
app.get("/token", async (req, res) => {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();
  res.json(data); // returns { access_token, expires_in, ... }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
