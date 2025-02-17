import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { SentKudosList } from "../../services/api";

const ReceivedKudos = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await SentKudosList();
      setData(data);
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  return (
    <Paper
      sx={{
        mt: 3,
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
        🎉 Sent Kudos
      </Typography>
      <List sx={{ mt: 2 }}>
        {data.map((kudos, index) => {
          const colors = ["#E3F2FD", "#FFEBEE", "#E8F5E9", "#FFF9C4"];
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
                    <Typography fontWeight="bold" color="#102027">
                      {kudos.sender_full_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {kudos.sender} • 12:30 PM
                    </Typography>
                  </>
                }
                secondary={
                  <Typography color="#37474F" mt={1} fontSize={16}>
                    {kudos.message}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default ReceivedKudos;
