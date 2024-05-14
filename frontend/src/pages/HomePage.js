import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import Paginator from '../components/Paginator';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Card from 'react-bootstrap/Card';

import "./HomePage.css"


const HomePage = () => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [profile, setProfile] = useState([])
    const [items, setItems] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(3)

    useEffect(() => {
        getProfile();
        getItems();
    },[])

    const getProfile = async() => {
        let response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
        })
       let data = await response.json();
        if(response.status === 200){
            setProfile(data);
        } else if(response.statusText === 'Unauthorized'){
            logoutUser();
        }
    }  

    const getItems = async() => {
        let response = await fetch('http://127.0.0.1:8000/api/profile_history', {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
        })
        let data = await response.json();
       
        if(response.status === 200){
            setItems(data);
        } else if(response.statusText === 'Unauthorized'){
            logoutUser();
        }
    }

    const lastItemIndex = currentPage * itemsPerPage;
    const firstPostIndex = lastItemIndex - itemsPerPage; 
    const currentItems = items.slice(firstPostIndex, lastItemIndex)

    return (
        <div>
            <p>You are logged in to the homepage!</p>
            {profile && profile.user && ( // Check if profile and profile.user exist
                <div>
                    <p>Name: {profile.user.username}</p>
                    <p>Email: {profile.user.email}</p>
                    <p>Money: {profile.money}</p>
                </div>
            )}

                <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>{
                            currentItems.map((w, i) => {
                                return  (
                                <Grid item xs={4}>
                                    <Card style={{ width: '18rem' }}>
                                    <Card.Img variant="top" src={w.steam_image} />
                                    <Card.Body>
                                    <Card.Title>{w.weapon_name}</Card.Title>
                                    <Card.Text>
                                        {w.skin_name}
                                    </Card.Text>
                                    
                                    </Card.Body>
                                    </Card>
                                </Grid>
                            )
                            })
                }</Grid>
                </Box>
                <div class='paginator'>
                    <Paginator totalPages={Math.ceil(items.length/itemsPerPage)} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                </div>
        </div>
    )
}



export default HomePage