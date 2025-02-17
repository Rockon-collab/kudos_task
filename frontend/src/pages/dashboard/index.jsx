import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItemText,
  ListItem,
} from "@mui/material";
import { DashboardSummary } from "../../services/api";

const Dashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await DashboardSummary();
      setData(data);
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {data.user_name}! 👋
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Ready to spread some positivity? Send kudos to your teammates!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              bgcolor: "#0288d1",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Kudos sent
            </Typography>
            <Typography variant="body2">{data.total_kudos_sent}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              bgcolor: "#6a1b9a",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Received kudos
            </Typography>
            <Typography variant="body2">{data.kudos_received}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              bgcolor: "#38448e",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Total members
            </Typography>
            <Typography variant="body2">{data.team_members}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        sx={{
          mt: 8,
          p: 3,
          bgcolor: "#f4f7fc",
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#263238"
          gutterBottom
          textAlign="center"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          Top Receivers
        </Typography>
        <List sx={{ mt: 2 }}>
          {data.top_receivers?.map((kudos, index) => {
            const colors = ["#FFEBEE", "#E3F2FD", "#FFF9C4", "#E8F5E9"];
            return (
              <ListItem
                key={index}
                sx={{
                  bgcolor: colors[index % colors.length],
                  borderRadius: 2,
                  mb: 1.5,
                  boxShadow: 2,
                  p: 2.5,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <ListItemText
                  primary={
                    <>
                      <Box sx={{display: 'flex', gap: 1}}>
                        <Typography fontWeight="bold" color="#102027">
                          {kudos.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • {kudos.kudos_received} kudos
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {kudos.organization}
                      </Typography>
                    </>
                  }
                  secondary={
                    <Typography color="#37474F" mt={1} fontSize={16}>
                      {kudos.email}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard;
