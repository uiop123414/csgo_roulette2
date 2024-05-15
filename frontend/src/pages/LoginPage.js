import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Grid from "@mui/material/Grid";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);

  console.log(loginUser)

  return (
    <div id="login">
      {/* <form onSubmit={loginUser}>
                <input type="text" name="username" placeholder="Enter username"/>
                <input type="password" name="password" placeholder="enter password"/>
                <input type="submit"/>
            </form> */}
      <div>
        <Grid container spacing={3} id="grid">
          <Grid item xs={4}>
            <Form onSubmit={ loginUser}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" name="username" />
                <Form.Text className="text-muted">
                  <p>We'll never share your email with anyone else.</p>
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" name="password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default LoginPage;
