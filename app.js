const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
require("dotenv").config();

app.get("/", async (req, res) => {
  //params
  let location;
  req.query.location === "vancouver"
    ? (location = "Vancouver, British Columbia, Canada")
    : (location = "Toronto, British Columbia,Canada");

  // const location = req.query.location || "Vancouver, British Columbia, Canada"; //vancouver toronto -> 43.66006373299547, -79.39866377573466
  const gender = req.query.gender || "male";
  const age = req.query.age || "baby";
  const size = req.query.size || "large";
  const kids = req.query.kids || 1;
  const hairLength = req.query.hairLength || "short";

  const api_url = `https://api.petfinder.com/v2/animals?&location=${location}&gender=${gender}&age=${age}&size=${size}&coat=${hairLength}&good_with_children=${kids}&distance=500`;

  const Bearer = await axios
    .post("https://api.petfinder.com/v2/oauth2/token", {
      grant_type: process.env.PETFINDER_GRANT_TYPE,
      client_id: process.env.PETFINDER_API_KEY,
      client_secret: process.env.PETFINDER_SECRET_KEY,
    })
    .then((res) => {
      return res.data.access_token;
    });

  try {
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Bearer ${Bearer}`,
      },
    });
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
