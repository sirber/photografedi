import { useUser } from "@/repositories/userRepository";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function UserNav() {
  const { data: user } = useUser();
  const navigate = useNavigate();

  const guest = (
    <>
      <Button color="inherit" onClick={() => navigate("/auth/register")}>
        Register
      </Button>

      <Button color="inherit" onClick={() => navigate("/auth/login")}>
        Login
      </Button>
    </>
  );

  const authenticated = (
    <>
      <Button color="inherit" onClick={() => navigate("/user/profile")}>
        Profile
      </Button>

      <Button color="inherit" onClick={() => navigate("/auth/logout")}>
        Logout
      </Button>
    </>
  );

  return user?.ok ? authenticated : guest;
}
