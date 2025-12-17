import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { PropsWithChildren } from "react";
import { TopNav } from "@/components/TopNav";

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <TopNav />
      <Box sx={{ marginTop: "6rem" }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </>
  );
}

export default Layout;
