import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";

import AuthContext from "../context/AuthContext";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import McRoulette from "../components/Roulette/McRoulette";
import CardLink from 'react-bootstrap/CardLink'
import Card from "react-bootstrap/Card";
import axios from "axios";

const GamesPage = () => {

  const params = useParams();
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

  console.log("name ", params.name);

  if (typeof params.name !== "undefined"){
      return (
          <div>
          <McRoulette
              transitionDuration={transitionDuration} slot_name={ params.name}/>
          </div>
      )
  }

  //Get slots names
  else{
      return (
        <div className="slots">
          <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={4}>
          {slots.map((w, i) => {
            return (
                <Grid xs={3}>
                  <Card style={{ width: "18rem" }}>
                    <CardLink href={"/games/"+w['slot_name']}>
                      <Card.Img variant="top" src={w['image']} />
                    </CardLink>
                    <Card.Title>
                      <h1 className="text-danger">Id: {w['slot_name']}</h1>
                    </Card.Title>
                    <Card.Text>
                      <h3 className="text-secondary">
                      Simple Cs Go container</h3>
                  </Card.Text>
                  </Card>
                </Grid>
            );
        })}
        </Grid>
        </Box>
        </div>
      );
    }
};

export default GamesPage;
