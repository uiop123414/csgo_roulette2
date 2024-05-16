import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Paginator from "../components/Paginator";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import axios from "axios";

const HomePage = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [profile, setProfile] = useState([]);
  const [items, setItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [sorting,setSorting] = useState(false);
  const [itemStatus,setItemStatus] = useState(false)


  useEffect(() => {
    getProfile();
    getItems();
  }, []);

  const getProfile = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
    console.log(data)
    if (response.status === 200) {
      setProfile(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  const getItems = async (itemStatus=false) => {
    let response = await fetch("http://127.0.0.1:8000/api/profile_history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
        
      },
      body: JSON.stringify({"item_status":itemStatus,})
    });

    let data = await response.json();

    if (response.status === 200) {
      setItems(data);
      setItemStatus(itemStatus);

    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };


  const lastItemIndex = currentPage * itemsPerPage;
  const firstPostIndex = lastItemIndex - itemsPerPage;
  const currentItems = items.slice(firstPostIndex, lastItemIndex);


  const sellItem = (game_id) => {
    axios.post("http://127.0.0.1:8000/api/sell_item",{game_id: game_id,}, {
        headers: 
        {
          Authorization: "Bearer " + String(authTokens.access),
          
          'Content-Type': 'application/json',
        },
      }
    ).then( (response) =>{ 

      console.log(response.status)
    
      if(response.status === 200){
        setItems(items.filter(obj => game_id !== obj.game_id))
      }
    }
    ).catch((error)=>{

    })
  }
  
  const sortItems = () => {
    if (sorting){
      setItems(items.sort((a, b) => Number(a.cost) - Number(b.cost)))
    } 
    else{
      setItems(items.sort((a, b) => Number(a.cost) - Number(b.cost)).reverse())
    }
    setSorting(!sorting)
  }

  const sellButton = (item) => {
    if (!itemStatus) {
      return (
      <Grid item xs={6}>
        <Button onClick={() => {
          console.log(item)
          profile.credit = parseFloat(profile.credit) + parseFloat(item.cost)
          sellItem(item.game_id)}}>Sell Item</Button>
      </Grid>)
      }
  }

  const adminButton = () => {
    if(typeof profile['user']!== 'undefined' && Boolean(profile['user']['is_staff']))
      return (
        <Grid item xs={3} >
        <Button href="/admin">Admin</Button>
      </Grid>
    )
  }

  return (
    <div>

      {profile &&
        profile.user && ( // Check if profile and profile.user exist
          <div className="user-data">
            <p>You are logged in to the homepage!</p>
            <p>Name: {profile.user.username}</p>
            <p>Email: {profile.user.email}</p>
            <p>Money: {profile.credit}</p>
          </div>
        )}
      <div id="filter-buttons">
      <Box sx = {{flexGrow: 1}} >
        <Grid container spacing={2}>
          <Grid item xs={3} >
            <Button onClick={()=>{getItems()}}>Current Items</Button>
          </Grid>  
          <Grid item xs={3} >
            <Button onClick={()=>{getItems(true)}}>Sold Items History</Button>
          </Grid>
          <Grid item xs={3} >
            <Button onClick={()=>{sortItems()}}>Sort Items</Button>
          </Grid>
          {adminButton()}

        </Grid>
      </Box>
      </div>  

      <Box sx={{ flexGrow: 1 }} className="items-container">
        <Grid container spacing={2}>
          {currentItems.map((w, i) => {
            return (
              <Grid item xs={4}>
                <Card style={{ width: "18rem" }}>
                  <Card.Img variant="top" src={w.steam_image} />
                  <Card.Body>
                    <Card.Title><h1>{w.weapon_name}</h1></Card.Title>
                    <Card.Text>
                     <h3 className="text-secondary">{w.skin_name}</h3></Card.Text>
                     <div>
                     <Grid container spacing={2}>
                     <Grid item xs={6}>
                        <h3>Price: {w.cost}$</h3>
                      </Grid>
                      {sellButton(w)}
                      </Grid>
                    </div>
                  </Card.Body>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>


      <div className="paginator">
        <Paginator
          totalPages={Math.ceil(items.length / itemsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default HomePage;
