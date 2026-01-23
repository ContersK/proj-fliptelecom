"use client";

import { Box } from "@chakra-ui/react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <Sidebar onToggle={(collapsed) => setSidebarCollapsed(collapsed)} />

      {/* Conteúdo com margem dinâmica */}
      <Box
        ml={{ base: 0, md: sidebarCollapsed ? "80px" : "280px" }}
        transition="margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        minH="100vh"
        display="flex"
        flexDirection="column"
      >
        <Navbar />

        <Box p={{ base: 4, md: 6, lg: 8 }} flex="1">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
