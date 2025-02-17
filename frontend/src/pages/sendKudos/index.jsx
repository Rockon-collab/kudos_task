import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { GiveKudos, UsersList } from "../../services/api";

const SendKudos = () => {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const { data } = await UsersList();
      setData(data);
    } catch (error) {
      alert("Something went wrong!");
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await GiveKudos(formData);
      setFormData({ email: "", message: "" });
      alert("Successfully sent");
    } catch (error) {
      alert(error.response.data?.non_field_errors[0]);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={6}
        sx={{
          p: 5,
          mt: 5,
          textAlign: "center",
          borderRadius: 3,
          background: "linear-gradient(135deg, #f3e5f5, #e3f2fd)",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={2}
          color="secondary"
          sx={{ fontFamily: "'Poppins', sans-serif" }}
        >
          🎉 Send Kudos!
        </Typography>

        <Typography
          variant="body1"
          color="textSecondary"
          mb={3}
          sx={{ fontStyle: "italic" }}
        >
          Show appreciation to your colleagues with a quick message.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            select
            label="Select User"
            variant="outlined"
            fullWidth
            required
            name="email"
            value={formData.user}
            onChange={handleChange}
            sx={{
              bgcolor: "#f5f5f5",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            {data.map((item) => (
              <MenuItem key={item.id} value={item.email}>
                {item.first_name} {item.last_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Message"
            type="text"
            variant="outlined"
            fullWidth
            required
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{
              bgcolor: "#f5f5f5",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#f5f5f5",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              fontWeight: "bold",
              borderRadius: "50px",
              textTransform: "none",
              fontSize: "16px",
              letterSpacing: "0.8px",
              transition: "0.3s",
              bgcolor: "#ff6f00",
              ":hover": {
                bgcolor: "#ff8f00",
                transform: "scale(1.05)",
              },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Send Kudos <Send />
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SendKudos;
