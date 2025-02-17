import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  Dashboard,
  Logout,
  Mail,
  Send,
  ThumbUp,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { DashboardSummary, LogoutToken } from "../../services/api";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await DashboardSummary();
    setData(data);
  };

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      await LogoutToken(refresh);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      navigate("/auth");
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f4f6f8" }}>
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: sidebarOpen ? 250 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? 250 : 80,
            transition: "width 0.3s",
            boxSizing: "border-box",
            bgcolor: "#1e293b",
            color: "white",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
        >
          {sidebarOpen && (
            <Typography variant="h6">{data.user_organization}</Typography>
          )}
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ color: "white" }}
          >
            <ChevronLeft />
          </IconButton>
        </Toolbar>

        <Divider sx={{ bgcolor: "#374151" }} />

        <List>
          {[
            { text: "Dashboard", icon: <Dashboard />, route: "/" },
            {
              text: "Received Kudos",
              icon: <ThumbUp />,
              route: "/receivedkudos",
            },
            { text: "Sent Kudos", icon: <Send />, route: "/sentkudos" },
            { text: "Send New Kudos", icon: <Mail />, route: "/sendkudos" },
          ].map(({ text, icon, route }) => (
            <ListItem
              button
              key={text}
              onClick={() => navigate(route)}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "#374151" },
                transition: "0.3s",
                cursor: "pointer",
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {icon}
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary={text} />}
            </ListItem>
          ))}

          <Divider sx={{ bgcolor: "#374151", my: 2 }} />

          {/* Logout Button */}
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              color: "#ff4d4d",
              "&:hover": { bgcolor: "#ff4d4d1a" },
              transition: "0.3s",
              bottom: 0,
              cursor: "pointer",
            }}
          >
            <ListItemIcon sx={{ color: "#ff4d4d", minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, transition: "margin 0.3s" }}>
        <AppBar
          position="sticky"
          sx={{ bgcolor: "#1e293b", boxShadow: "none", px: 2 }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{ color: "white", display: isMobile ? "block" : "none" }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                color: "white",
                textAlign: isMobile ? "center" : "left",
                flexGrow: 1,
              }}
            ></Typography>

            {/* User Info & Kudos */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Kudos balance
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "20px",
                    fontSize: isMobile ? "12px" : "16px",
                    bgcolor: "#ff6f00",
                    padding: "2px 16px",
                    "&:hover": { bgcolor: "#e65c00" },
                  }}
                >
                  {data.user_kudos_balance}
                </Button>
              </Box>

              <Avatar
                src={""}
                sx={{ width: 40, height: 40, border: "2px solid white" }}
              />

              {!isMobile && (
                <Box>
                  <Typography sx={{ color: "white", fontWeight: "bold" }}>
                    {data.user_name}
                  </Typography>
                  <Typography sx={{ color: "#ffffffdb" }}>
                    {data.user_email}
                  </Typography>
                </Box>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content (Dynamic) */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
