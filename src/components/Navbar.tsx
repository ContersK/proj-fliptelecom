"use client";

import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  // Namespaces do v3
  Menu,
  Popover,
  Avatar,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { Bell, User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Fechamento de Comissão",
    msg: "Ocorre dia 25/01.",
    type: "warning",
  },
  {
    id: 2,
    title: "Novo Funcionário",
    msg: "Roberto Silva adicionado.",
    type: "info",
  },
];

export function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.refresh();
    router.push("/login");
  }

  return (
    <Box
      as="header"
      w="full"
      h="70px"
      bg="white"
      boxShadow="sm"
      px={8}
      position="sticky"
      top={0}
      zIndex={90}
    >
      <Flex h="full" align="center" justify="space-between">
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Visão Geral
        </Text>

        <HStack gap={6}>
          {/* --- NOTIFICAÇÕES (POPOVER v3) --- */}
          <Popover.Root positioning={{ placement: "bottom-end" }}>
            <Popover.Trigger asChild>
              <Box position="relative" cursor="pointer">
                <IconButton
                  aria-label="Notificações"
                  variant="ghost"
                  color="gray.500"
                >
                  <Bell size={20} />
                </IconButton>
                <Badge
                  position="absolute"
                  top="2px"
                  right="2px"
                  colorPalette="red"
                  variant="solid"
                  size="xs"
                  rounded="full"
                >
                  {NOTIFICATIONS.length}
                </Badge>
              </Box>
            </Popover.Trigger>

            <Popover.Content
              width="320px"
              bg="white"
              boxShadow="xl"
              borderRadius="lg"
            >
              <Popover.Arrow />
              <Popover.Body p={0}>
                <Box
                  p={3}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  bg="gray.50"
                >
                  <Text fontWeight="bold" fontSize="sm">
                    Notificações
                  </Text>
                </Box>
                <VStack align="stretch" gap={0} maxH="300px" overflowY="auto">
                  {NOTIFICATIONS.map((note) => (
                    <Box
                      key={note.id}
                      p={3}
                      borderBottom="1px solid"
                      borderColor="gray.50"
                      _hover={{ bg: "blue.50" }}
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color={
                          note.type === "warning" ? "orange.600" : "blue.600"
                        }
                      >
                        {note.title}
                      </Text>
                      <Text fontSize="xs" color="gray.600" mt={1}>
                        {note.msg}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Popover.Body>
            </Popover.Content>
          </Popover.Root>

          {/* --- PERFIL (MENU v3) --- */}
          <Menu.Root positioning={{ placement: "bottom-end" }}>
            <Menu.Trigger asChild>
              <HStack gap={3} cursor="pointer" _hover={{ opacity: 0.8 }}>
                <VStack
                  gap={0}
                  align="end"
                  display={{ base: "none", md: "flex" }}
                >
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">
                    Luan G.
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Administrador
                  </Text>
                </VStack>
                {/* Avatar v3 Nativo */}
                <Avatar.Root size="sm" bg="blue.600" color="white">
                  <Avatar.Fallback>LG</Avatar.Fallback>
                  {/* <Avatar.Image src="" /> */}
                </Avatar.Root>
              </HStack>
            </Menu.Trigger>

            <Menu.Content
              minW="180px"
              bg="white"
              borderRadius="md"
              boxShadow="lg"
            >
              <Menu.Item
                value="profile"
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                p={2}
              >
                <HStack>
                  <User size={16} />
                  <Text>Meu Perfil</Text>
                </HStack>
              </Menu.Item>
              <Menu.Item
                value="settings"
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                p={2}
              >
                <HStack>
                  <Settings size={16} />
                  <Text>Configurações</Text>
                </HStack>
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item
                value="logout"
                color="red.600"
                cursor="pointer"
                _hover={{ bg: "red.50" }}
                onClick={handleLogout}
                p={2}
              >
                <HStack>
                  <LogOut size={16} />
                  <Text>Sair</Text>
                </HStack>
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </HStack>
      </Flex>
    </Box>
  );
}
