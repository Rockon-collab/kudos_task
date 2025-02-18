import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material";
import { Login, Organizations, SignUp } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [oranization, setOranization] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    password: "",
    password2: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    organizationsListCaller();
  }, []);

  const organizationsListCaller = async () => {
    try {
      const { data } = await Organizations();
      setOranization(data);
    } catch (error) {}
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      try {
        await SignUp(formData);
        setIsSignUp(false);
      } catch (error) {
        if (error.response.data.password2) {
          alert(error.response.data.password2[0]);
        } else {
          alert("Something went wrong");
        }
      }
    } else {
      try {
        const { data } = await Login(formData);
        localStorage.setItem("token", data.token.access);
        localStorage.setItem("refresh", data.token.refresh)
        navigate("/");
      } catch (error) {
        alert("Something went wrong!");
      }
    }
  };

  const handleToggle = () => {
    setIsSignUp((prev) => !prev);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      organization: "",
      password: "",
      password2: "",
    });
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 5, textAlign: "center", borderRadius: 2 }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          {isSignUp
            ? "Join us and start sending kudos to your teammates"
            : "Sign in to your account to continue"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {isSignUp && (
            <>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </>
          )}
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {isSignUp && (
            <TextField
              select
              label="Organization"
              variant="outlined"
              fullWidth
              required
              name="organization"
              value={formData.organization}
              onChange={handleChange}
            >
              {oranization.map((item) => (
                <MenuItem value={item?.name}>{item?.name}</MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {isSignUp && (
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              name="password2"
              value={formData.password2}
              onChange={handleChange}
            />
          )}

          {!isSignUp && (
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
              }
              label="Remember me"
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            {isSignUp ? "Create Account" : "Sign in"}
          </Button>

          {!isSignUp && (
            <Typography variant="body2" sx={{ textAlign: "right", mt: -1 }}>
              <Button variant="text" color="primary">
                Forgot password?
              </Button>
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 2 }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button variant="text" color="primary" onClick={handleToggle}>
              {isSignUp ? "Sign in" : "Sign up"}
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;
