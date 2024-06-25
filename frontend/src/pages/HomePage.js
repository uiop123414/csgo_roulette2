import React, { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Paginator from "../components/Paginator";
import { setname } from "../namestate/nameSlice";
import { setItems } from "../namestate/itemsSlice";
import { setUser } from "../namestate/userSlice";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";

const HomePage = () => {
  const didMount = useRef(false);
  const { authTokens, logoutUser } = useContext(AuthContext);
  
  const [itemsCount, setItemsCount] = useState(0);
  const [isSold, setIsSold] = useState(false);
  const [showEditWindow, setShowEditWindow] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [sorting, setSorting] = useState(false);
  const [itemStatus, setItemStatus] = useState(false);

  const name = useSelector((state) => state.name.value);
  const items = useSelector((state) => state.items.value);
  const user = useSelector((state)=> state.user.value);

  const [itemToEdit,SetItemToEdit] = useState(null);
  const [rarities, setRarities] = useState([]);

  const [updateItem, setUpdateItem] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    getProfile();
    getItems();
    axios
    .get("http://127.0.0.1:8000/api/rarities")
    .then((response) => setRarities(response.data))
    .catch((error) => console.log(error));
  }, []);

  const getProfile = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
        isSold: isSold,
      },
    });
    let data = await response.json();
    console.log(data);
    if (response.status === 200) {
      dispatch(setUser(data));
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  const getItems = async (itemStatus = false) => {
    let response = await fetch("http://127.0.0.1:8000/api/profile_history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({ item_status: itemStatus, pageNumber: currentPage, itemsPerPage: itemsPerPage,startText:name}),
    });

    let data = await response.json();

    if (response.status === 200) {
      dispatch(setItems(data["items"]));
      setItemsCount(data["count"]);
      setItemStatus(itemStatus);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  const sellItem = (game_id) => {
    axios
      .post(
        "http://127.0.0.1:8000/api/sell_item",
        { game_id: game_id },
        {
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => {
        console.log(response.status);

        if (response.status === 200) {
          getItems();
        }
      })
      .catch((error) => {});
  };

  const sortItems = () => {
    if (sorting) {
      dispatch(setItems(items.sort((a, b) => Number(a.cost) - Number(b.cost))));
    } else {
      dispatch(setItems(items.sort((a, b) => Number(a.cost) - Number(b.cost)).reverse()));
    }
    setSorting(!sorting);
  };

  const sellButton = (item) => {
    if (!itemStatus) {
      return (
        <Grid item xs={6}>
          <Button
            onClick={() => {
              sellItem(item.game_id);
              setUpdateItem(!updateItem);
            }}
          >
            Sell Item
          </Button>
        </Grid>
      );
    }
  };

  const EditModalWindow = () =>{
    if (itemToEdit !== null){

      const updateButton = (event) => {
        console.log(itemToEdit);
        event.preventDefault();
        axios.post(
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
        ).then();
        setUpdateItem(!updateItem);
      };

    return (
      <Modal show={showEditWindow} onHide={() => setShowEditWindow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Grid item xs={4}>
            <Card.Img variant="top" src={itemToEdit.steam_image} />
            <Form onSubmit={updateButton}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Item id</Form.Label>
                <Form.Control name="id" placeholder="Enter Name Item" disabled value={itemToEdit.id} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Item Name</Form.Label>
                <Form.Control name="weapon" placeholder="Enter Name Item" defaultValue={itemToEdit.weapon_name} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Skin Name</Form.Label>
                <Form.Control name="skin" placeholder="Enter Name Item" defaultValue={itemToEdit.skin_name} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Price</Form.Label>
                <Form.Control name="price" placeholder="Enter Name Item" defaultValue={itemToEdit.cost} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Steam image</Form.Label>
                <Form.Control name="steam_image" placeholder="Enter Name Item" value={itemToEdit.steam_image} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Item rarity</Form.Label>
                <Form.Select name="rarity" defaultValue={itemToEdit.rarity}>
                  {rarities.map((w, i) => {
                   return <option>{w["name"]}</option>;
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                          <Button type="submit" onClick={() => setShowEditWindow(false)}> Update</Button>
              </Form.Group>
            </Form>
          </Grid>
          <Button variant="secondary" onClick={() => setShowEditWindow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
    }
  }

  const editItem = (item) => {
    if (typeof user["user"] !== "undefined" && Boolean(user["user"]["is_staff"])){
      return (
        <Grid item xs={12}>
          <Button
            onClick={() => {
              SetItemToEdit(item);
              setShowEditWindow(true);
              }}>
            Edit Item
          </Button>
        </Grid>
      );
    }
  };

  const adminButton = () => {
    if (typeof user["user"] !== "undefined" && Boolean(user["user"]["is_staff"])){
      return (
        <Grid item xs={3}>
          <Button href="/admin">Admin</Button>
        </Grid>
      );
    }
  };

  useEffect(() => {
    // action on update of movies
    if (didMount.current) {
      getProfile();
      getItems(isSold);
    } else didMount.current = true;
  }, [currentPage, isSold, updateItem, name]);

  return (
    <div>
      {user &&
        user.user && ( // Check if profile and profile.user exist
          <div className="user-data">
            <p>You are logged in to the homepage!</p>
            <p>Name: {user.user.username}</p>
            <p>Email: {user.user.email}</p>
            <p>Money: {user.credit}</p>
          </div>
        )}
      <div id="filter-buttons">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Button
                onClick={() => {
                  setIsSold(false);
                }}
              >
                Current Items
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                onClick={() => {
                  setIsSold(true);
                }}
              >
                Sold Items History
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                onClick={() => {
                  sortItems();
                }}
              >
                Sort Items
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Form inline>
                <InputGroup>
                  <Form.Control
                    onChange={(event) => {
                      event.preventDefault();
                      console.log(event.target.value);
                      dispatch(setname(event.target.value));
                    }}
                    placeholder="WeaponName"
                    name="name"
                    type="text"
                  />
                </InputGroup>
              </Form>
            </Grid>
            {adminButton()}
          </Grid>
        </Box>
      </div>

      <Box sx={{ flexGrow: 1 }} className="items-container">
        <Grid container spacing={2}>
          {items.map((w, i) => {
            // if (w.weapon_name.toLowerCase().startsWith(name)) {
              return (
                <Grid item xs={4}>
                  <Card style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={w.steam_image} />
                    <Card.Body>
                      <Card.Title>
                        <h1>{w.weapon_name}</h1>
                      </Card.Title>
                      <Card.Text>
                        <h3 className="text-secondary">{w.skin_name}</h3>
                      </Card.Text>
                      <div>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <h4>Price: {w.cost}$</h4>
                          </Grid>
                          {sellButton(w)}
                          {editItem(w)}
                        </Grid>
                      </div>
                    </Card.Body>
                  </Card>
                </Grid>
              );
            // }
          })}
        </Grid>
      </Box>

      <div className="paginator">
        <Paginator
          totalPages={Math.ceil(itemsCount / itemsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      
      {EditModalWindow()}
      
    </div>
  );
};

export default HomePage;
