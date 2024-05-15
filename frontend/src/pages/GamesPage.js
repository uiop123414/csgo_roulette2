import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";

import AuthContext from "../context/AuthContext";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import McRoulette from "../components/Roulette/McRoulette";

import Card from "react-bootstrap/Card";
import axios from "axios";

const GamesPage = () => {
  let name;

  name = useParams();
  const [slots, setSlots] = useState([]);
  const transitionDuration = 10;

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/slots")
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .then((data) => setSlots(data));
  }, []);

  console.log("name ", slots);

  // if (name === "CSGO_1"){
  //     return (
  //         <div>
  //         <McRoulette
  //             transitionDuration={transitionDuration}/>
  //         </div>
  //     )
  // }

  //Get slots names

  return (
    <div>
      {slots.map((w, i) => {
        return (
          <div>
            <p>Id: {w}</p>
          </div>
        );
      })}
    </div>
  );
};

export default GamesPage;
