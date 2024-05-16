import React, { useState, useEffect, useContext } from "react";
import { Grid } from "@mui/material";
import { Button } from "react-bootstrap";
import {Box} from "@mui/material";
import Form from 'react-bootstrap/Form';

const AdminPage = () => {

    const [create,setCreate] = useState(false)
    const [edit, setEdit] = useState(false)

    const createItem = () =>{
        if(create && !edit){
            return(
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>Weapon name</Form.Label>
                <Form.Control placeholder="Weapon name"  />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Skin name</Form.Label>
                <Form.Control placeholder="Skin name"  />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Item rarity</Form.Label>
                <Form.Select >
                <option>milspec</option>
                <option>rare</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Bind to slot</Form.Label>
                <Form.Select >
                <option>CSGO_1</option>
                <option>CSGO_2</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Steam image</Form.Label>
                <Form.Control placeholder="Steam image" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control placeholder="Price" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Button>Create Item</Button>
            </Form.Group>    
        </Form>
        )
        }
    }

    const editItem = () =>{

    }

    return (
        <div className="admin-buttons">
            <Box sx = {{flexGrow: 1}} >
                <Grid  item container xs={6} spacing={12}>
                    <Grid item xs={4} >
                        <Button onClick={()=>{
                            setCreate(true);
                            setEdit(false);
                            }}>Create Item</Button>
                    </Grid>  
                    <Grid item xs={4} >
                        <Button onClick={()=>{setCreate(false);
                                              setEdit(true);}}>Edit Item</Button>
                    </Grid>
                </Grid>
            </Box>
            {createItem()}
            {editItem()}
        </div>
    )

} 

export default AdminPage;