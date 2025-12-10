import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { UserNav } from "./UserNav";

export function TopNav() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            PhotograFedi
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button color="inherit">About</Button>
          <UserNav />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
