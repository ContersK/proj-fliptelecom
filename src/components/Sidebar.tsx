"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Flex,
  Image,
  Spacer,
  IconButton,
  Tooltip, // Importamos o namespace Tooltip
} from "@chakra-ui/react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const MENU_ITEMS = [
  { name: "Principal", icon: LayoutDashboard, path: "/" },
  { name: "Comissões", icon: FileText, path: "/comissoes" },
  { name: "Funcionários", icon: Users, path: "/funcionarios" },
  { name: "Configurações", icon: Settings, path: "/configuracoes" },
];

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

export function Sidebar({ onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function handleCollapse() {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onToggle) onToggle(newState);
  }

  return (
    <Box
      as="aside"
      w={collapsed ? "80px" : "280px"}
      h="100vh"
      bg="#0044CC"
      color="white"
      position="fixed"
      left={0}
      top={0}
      zIndex={100}
      transition="width 0.3s ease"
      borderRight="1px solid rgba(255,255,255,0.1)"
      display={{ base: "none", md: "block" }}
    >
      <VStack h="full" align="stretch" gap={0}>
        {/* CABEÇALHO */}
        <Flex
          h="70px"
          align="center"
          justify={collapsed ? "center" : "space-between"}
          px={collapsed ? 2 : 6}
          bg="white"
        >
          {!collapsed ? (
            <Image
              src="/logo-flip.png"
              alt="Flip"
              h="32px"
              objectFit="contain"
            />
          ) : (
            <Text color="#0044CC" fontWeight="bold" fontSize="xl">
              F
            </Text>
          )}
        </Flex>

        {/* BOTÃO DE CONTROLE */}
        <Box position="absolute" right="-12px" top="84px" zIndex={110}>
          <IconButton
            aria-label="Toggle Sidebar"
            onClick={handleCollapse}
            size="xs"
            rounded="full"
            // No v3, cores personalizadas vão em css var ou bg direto se não estiverem no tema
            bg="blue.500"
            color="white"
            shadow="md"
            _hover={{ bg: "blue.600" }}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </IconButton>
        </Box>

        {/* MENU */}
        <VStack align="stretch" gap={2} p={collapsed ? 2 : 4} mt={4}>
          {!collapsed && (
            <Text fontSize="xs" fontWeight="bold" opacity={0.6} pl={4} mb={2}>
              MENU
            </Text>
          )}

          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;

            const LinkContent = (
              <HStack
                px={collapsed ? 0 : 4}
                justify={collapsed ? "center" : "flex-start"}
                h="48px"
                borderRadius="lg"
                cursor="pointer"
                transition="all 0.2s"
                bg={isActive ? "white" : "transparent"}
                color={isActive ? "#0044CC" : "white"}
                _hover={{ bg: isActive ? "white" : "rgba(255,255,255,0.1)" }}
                position="relative"
                w="full"
              >
                <Icon as={item.icon} boxSize={5} />

                {!collapsed && (
                  <Text
                    fontWeight="medium"
                    fontSize="sm"
                    whiteSpace="nowrap"
                    animation="fadeIn 0.2s"
                    ml={3}
                  >
                    {item.name}
                  </Text>
                )}
              </HStack>
            );

            return (
              <Link
                href={item.path}
                key={item.path}
                style={{ textDecoration: "none", width: "100%" }}
              >
                {collapsed ? (
                  // Tooltip v3 Nativo
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      {/* Box wrapper necessário para tooltip trigger funcionar bem em alguns casos */}
                      <Box>{LinkContent}</Box>
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                      <Tooltip.Content
                        bg="gray.800"
                        color="white"
                        px={2}
                        py={1}
                        rounded="md"
                        fontSize="xs"
                      >
                        {item.name}
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Tooltip.Root>
                ) : (
                  LinkContent
                )}
              </Link>
            );
          })}
        </VStack>

        <Spacer />

        {/* RODAPÉ */}
        <Box p={4} borderTop="1px solid rgba(255,255,255,0.1)">
          {/* Área livre para versão do sistema */}
          {!collapsed && (
            <Text fontSize="10px" textAlign="center" opacity={0.4}>
              v1.0
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
