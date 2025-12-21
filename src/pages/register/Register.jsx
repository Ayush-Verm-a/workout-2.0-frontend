import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import "./register-styles.scss";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="register__container">
      <Typography variant="h1" className="register__title">Register</Typography>

      <Box component="form">
        <div className="register__subcontainer">
          <TextField
            required
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        <Button variant="contained">Sign Up</Button>
        </div>
      </Box>
    </div>
  );
};

export default Register;
