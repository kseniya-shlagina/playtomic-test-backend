const JWT = require("jsonwebtoken");
const express = require("express");
const app = express();
const port = 3001;
const axios = require("axios");
const to = require("await-to-js").default;
const cors = require("cors");

const secretKey = "JNfdjnfUAHFUuohn3oR*@$O@$fb";

app.use(express.json());
app.use(cors());

// LOGIN

app.post("/login", (req, res) => {
  if (req.method === "POST") {
    const email = "testuser@gmail.com";
    const password = "123123123";

    if (req.body.email === email && req.body.password === password) {
      const token = JWT.sign(
        {
          email,
          name: "Kseniya Shlagina",
          _id: "01",
        },
        secretKey
      );

      try {
        JWT.verify(token, secretKey);
      } catch (error) {
        console.log(error);
      }

      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Wrong email or password " });
    }
  } else {
    res.status(404).end();
  }
});

// GET CHARACTERS

app.get("/characters", async (req, res) => {
  const authorizationToken = req.headers["authorization"];

  if (!authorizationToken) {
    res.status(401).json({ error: "No authorization header" });
    return;
  }

  const token = authorizationToken.split("Bearer ")[1];
  if (!token) {
    res.status(401).json({ error: "Wrong authorization payload" });
    return;
  }

  try {
    JWT.verify(token, secretKey);
  } catch (error) {
    res.status(401).json({ error: "Wrong JWT token" });
    return;
  }

  const [err, axiosResponse] = await to(
    axios.get("https://swapi.dev/api/people")
  );

  if (axiosResponse) {
    const data = axiosResponse.data.results.map((item) => {
      const {
        name,
        height,
        mass,
        hair_color,
        skin_color,
        eye_color,
        birth_year,
        gender,
      } = item;

      return {
        name,
        height,
        mass,
        hairColor: hair_color,
        skinColor: skin_color,
        eyeColor: eye_color,
        birthYear: birth_year,
        gender,
      };
    });

    res.status(200).json({
      data,
    });
  } else if (err) {
    res.status(401).json({ error: "Data request error" });
  }
});

// GET PLANETS

app.get("/planets", async (req, res) => {
  const authorizationToken = req.headers["authorization"];

  if (!authorizationToken) {
    res.status(401).json({ error: "No authorization header" });
    return;
  }

  const token = authorizationToken.split("Bearer ")[1];
  if (!token) {
    res.status(401).json({ error: "Wrong authorization payload" });
    return;
  }

  try {
    JWT.verify(token, secretKey);
  } catch (error) {
    res.status(401).json({ error: "Wrong JWT token" });
    return;
  }

  const [err, axiosResponse] = await to(
    axios.get("https://swapi.dev/api/planets")
  );

  if (axiosResponse) {
    const data = axiosResponse.data.results.map((item) => {
      const {
        name,
        rotation_period,
        orbital_period,
        diameter,
        climate,
        gravity,
        terrain,
      } = item;

      return {
        name,
        diameter,
        climate,
        gravity,
        terrain,
        rotationPeriod: rotation_period,
        orbitalPeriod: orbital_period,
      };
    });

    res.status(200).json({
      data,
    });
  } else if (err) {
    res.status(401).json({ error: "Data request error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
