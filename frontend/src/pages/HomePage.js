import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';

const HomePage = () => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    let [profile, setProfile] = useState([])

    useEffect(() => {
        getProfile()
    },[])

    const getProfile = async() => {
        let response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
        })
        let data = await response.json()
        if(response.status === 200){
            setProfile(data)
        } else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
    }

    return (
        <div>
            <p>You are logged in to the homepage!</p>
            {profile && profile.user && ( // Check if profile and profile.user exist
                <div>
                    <p>Name: {profile.user.username}</p>
                    <p>Email: {profile.user.email}</p>
                </div>
            )}
        </div>
    )
}

export default HomePage