import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { UserNav } from "./UserNav";
import { useUser } from "@/repositories/userRepository";
import { Link } from "@mui/material";

export function TopNav() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" color="inherit" underline="none">
              PhotograFedi
            </Link>
          </Typography>

          {user?.ok && (
            <Button color="inherit" onClick={() => navigate("/create")}>
              Create
            </Button>
          )}

          <Button color="inherit">About</Button>

          <UserNav />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
