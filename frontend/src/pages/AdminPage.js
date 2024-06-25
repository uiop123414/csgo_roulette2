import React, { useState, useEffect, useContext, useRef } from "react";
import { Grid } from "@mui/material";
import { Button } from "react-bootstrap";
import { Box } from "@mui/material";
import Form from "react-bootstrap/Form";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Card from "react-bootstrap/Card";

const AdminPage = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [rarities, setRarities] = useState([]);
  const [slots, setSlots] = useState([]);
  const [items, setItems] = useState([]);
  const didMount = useRef(false);

  useEffect(() => {
    axios
      .get(
        "http://127.0.0.1:8000/api/weapon",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        },
      )
      .then((promise) => setItems(promise.data));
  }, []);

  const createItem = () => {
    const sendCreate = (event) => {
      event.preventDefault();
      axios.post(
        "http://127.0.0.1:8000/api/create_item",
        {
          name: event.target.elements.weapon.value,
          skin: event.target.skin.value,
          rarity: event.target.rarity.value,
          slot_name: event.target.slot_name.value,
          steam_image: event.target.steam_image.value,
          price: event.target.price.value,
        },
        {
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
            "Content-Type": "application/json",
          },
        },
      );
    };

    if (create && !edit) {
      return (
        <Form onSubmit={sendCreate}>
          <Form.Group className="mb-3">
            <Form.Label>Weapon name</Form.Label>
            <Form.Control placeholder="Weapon name" name="weapon" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skin name</Form.Label>
            <Form.Control placeholder="Skin name" name="skin" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Item rarity</Form.Label>
            <Form.Select name="rarity">
              {rarities.map((w, i) => {
                return <option>{w["name"]}</option>;
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bind to slot</Form.Label>
            <Form.Select name="slot_name">
              {slots.map((w, i) => {
                return <option>{w["slot_name"]}</option>;
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Steam image</Form.Label>
            <Form.Control placeholder="Steam image" name="steam_image" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control placeholder="Price" name="price" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Button type="submit">Create Item</Button>
          </Form.Group>
        </Form>
      );
    }
  };

  const editItem = () => {
    if (!create && edit) {
      const updateButton = (event) => {
        event.preventDefault();
        axios
          .post(
            "http://127.0.0.1:8000/api/update_item",
            {
              id: event.target.elements.id.value,
              name: event.target.elements.weapon.value,
              skin: event.target.skin.value,
              rarity: event.target.rarity.value,
              steam_image: event.target.steam_image.value,
              price: event.target.price.value,
            },
            {
              headers: {
                Authorization: "Bearer " + String(authTokens.access),
                "Content-Type": "application/json",
              },
            },
          )
          .then((response) => {
            let data = response.data;
            let _items = items;
            _items.forEach((item) => {
              if (item.id === data.id) {
                item.weapon_name = data["weapon_name"];
                item.skin_name = data["skin_name"];
                item.steam_image = data["steam_image"];
                item.cost = data["cost"];
                item.rarity = data["rarity"];
              }
            });

            setItems(_items);
          })
          .catch((error) => console.log(error));
      };

      return (
        <Box sx={{ flexGrow: 1 }} className="items-container">
          <Grid container spacing={2}>
            {items.map((w, i) => {
              return (
                <Grid item xs={4}>
                  <Card style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={w.steam_image} />
                    <Card.Body>
                      <Form onSubmit={updateButton}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-secondary">Item id</Form.Label>
                          <Form.Control name="id" placeholder="Enter Name Item" disabled value={w.id} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-secondary">Item Name</Form.Label>
                          <Form.Control name="weapon" placeholder="Enter Name Item" defaultValue={w.weapon_name} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="text-secondary">Skin Name</Form.Label>
                          <Form.Control name="skin" placeholder="Enter Name Item" defaultValue={w.skin_name} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="text-secondary">Price</Form.Label>
                          <Form.Control name="price" placeholder="Enter Name Item" defaultValue={w.cost} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="text-secondary">Steam image</Form.Label>
                          <Form.Control name="steam_image" placeholder="Enter Name Item" value={w.steam_image} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="text-secondary">Item rarity</Form.Label>
                          <Form.Select name="rarity" defaultValue={w.rarity}>
                            {rarities.map((w, i) => {
                              return <option>{w["name"]}</option>;
                            })}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Button type="submit"> Update</Button>
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      );
    }
  };

  useEffect(() => {
    // action on update of movies

    if (didMount.current) {
    } else {
      didMount.current = true;
      axios
        .get("http://127.0.0.1:8000/api/rarities")
        .then((response) => setRarities(response.data))
        .catch((error) => console.log(error));

      axios
        .get("http://127.0.0.1:8000/api/slots")
        .then((response) => setSlots(response.data))
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <div className="admin-buttons">
      <Box sx={{ flexGrow: 1 }}>
        <Grid item container xs={6} spacing={12}>
          <Grid item xs={4}>
            <Button
              onClick={() => {
                setCreate(true);
                setEdit(false);
              }}
            >
              Create Item
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              onClick={() => {
                setCreate(false);
                setEdit(true);
              }}
            >
              Edit Item
            </Button>
          </Grid>
        </Grid>
      </Box>
      {createItem()}
      {editItem()}
    </div>
  );
};

export default AdminPage;
