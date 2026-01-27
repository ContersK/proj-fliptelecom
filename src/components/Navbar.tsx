'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  Menu,
  Popover,
  Avatar,
  Badge,
  VStack,
  Button,
} from '@chakra-ui/react';
import {
  Bell,
  LogOut,
  Settings,
  AlertCircle,
  Info,
  CheckCheck,
  Trash2,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFlipTheme } from '@/hooks/useFlipTheme';

type Notificacao = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  createdBy?: { name: string } | null;
};

export function Navbar() {
  const router = useRouter();
  const theme = useFlipTheme();
  const [notifications, setNotifications] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notificacoes');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkAsRead(id: string) {
    try {
      await fetch('/api/notificacoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  }

  async function handleMarkAllAsRead() {
    setLoading(true);
    try {
      await fetch('/api/notificacoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteNotification(id: string) {
    try {
      await fetch(`/api/notificacoes?id=${id}`, { method: 'DELETE' });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  }

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.refresh();
    router.push('/login');
  }

  function handleNavigate(path: string) {
    router.push(path);
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'warning':
        return <AlertCircle size={16} color="#dd6b20" />;
      case 'success':
        return <CheckCircle size={16} color="#38a169" />;
      case 'error':
        return <XCircle size={16} color="#e53e3e" />;
      default:
        return <Info size={16} color="#3182ce" />;
    }
  }

  function getNotificationBg(type: string) {
    switch (type) {
      case 'warning':
        return 'orange.100';
      case 'success':
        return 'green.100';
      case 'error':
        return 'red.100';
      default:
        return 'blue.100';
    }
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  }

  return (
    <Box
      as="header"
      w="full"
      h="70px"
      bg={theme.bgNavbar}
      boxShadow="sm"
      px={8}
      position="sticky"
      top={0}
      zIndex={90}
      borderBottom="1px solid"
      borderColor={theme.borderColor}
    >
      <Flex h="full" align="center" justify="space-between">
        <Text fontSize="lg" fontWeight="bold" color={theme.textPrimary}>
          Sistema de Gestão Flip Telecom
        </Text>

        <HStack gap={4}>
          {/* --- TOGGLE DE TEMA --- */}
          <IconButton
            aria-label="Alternar tema"
            variant="ghost"
            color={theme.textSecondary}
            _hover={{ bg: theme.bgHover }}
            borderRadius="full"
            onClick={theme.toggleColorMode}
          >
            {theme.colorMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          {/* --- NOTIFICAÇÕES (POPOVER v3) --- */}
          <Popover.Root positioning={{ placement: 'bottom-end' }}>
            <Popover.Trigger asChild>
              <Box position="relative" cursor="pointer">
                <IconButton
                  aria-label="Notificações"
                  variant="ghost"
                  color={theme.textSecondary}
                  _hover={{ bg: theme.bgHover }}
                  borderRadius="full"
                >
                  <Bell size={20} />
                </IconButton>
                {unreadCount > 0 && (
                  <Box
                    position="absolute"
                    top="6px"
                    right="6px"
                    w="8px"
                    h="8px"
                    bg="red.500"
                    borderRadius="full"
                    border="2px solid white"
                  />
                )}
              </Box>
            </Popover.Trigger>

            <Popover.Positioner>
              <Popover.Content
                width="380px"
                bg={theme.bgCard}
                boxShadow="xl"
                borderRadius="xl"
                overflow="hidden"
                border="1px solid"
                borderColor={theme.borderColor}
              >
                <Popover.Arrow />
                <Popover.Body p={0}>
                  <Flex
                    p={4}
                    borderBottom="1px solid"
                    borderColor={theme.borderLight}
                    justify="space-between"
                    align="center"
                  >
                    <Text fontWeight="bold" fontSize="sm" color={theme.textPrimary}>
                      Notificações
                    </Text>
                    <HStack gap={2}>
                      {unreadCount > 0 && (
                        <Badge colorPalette="blue" variant="subtle" fontSize="xs">
                          {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                        </Badge>
                      )}
                      {unreadCount > 0 && (
                        <Button
                          size="xs"
                          variant="ghost"
                          color="blue.500"
                          onClick={handleMarkAllAsRead}
                          loading={loading}
                          title="Marcar todas como lidas"
                        >
                          <CheckCheck size={14} />
                        </Button>
                      )}
                    </HStack>
                  </Flex>
                  <VStack align="stretch" gap={0} maxH="350px" overflowY="auto">
                    {notifications.length === 0 ? (
                      <Box p={8} textAlign="center">
                        <Text color={theme.textMuted} fontSize="sm">
                          Nenhuma notificação
                        </Text>
                      </Box>
                    ) : (
                      notifications.slice(0, 10).map((note) => (
                        <Flex
                          key={note.id}
                          p={4}
                          gap={3}
                          borderBottom="1px solid"
                          borderColor={theme.borderLight}
                          _hover={{ bg: theme.bgHover }}
                          cursor="pointer"
                          transition="all 0.2s"
                          bg={
                            note.read
                              ? theme.bgCard
                              : theme.colorMode === 'dark'
                                ? 'blue.900'
                                : 'blue.50'
                          }
                          onClick={() => !note.read && handleMarkAsRead(note.id)}
                        >
                          <Box
                            p={2}
                            borderRadius="full"
                            bg={getNotificationBg(note.type)}
                            h="fit-content"
                          >
                            {getNotificationIcon(note.type)}
                          </Box>
                          <Box flex={1}>
                            <Text fontSize="sm" fontWeight="semibold" color={theme.textPrimary}>
                              {note.title}
                            </Text>
                            <Text fontSize="xs" color={theme.textSecondary} mt={0.5}>
                              {note.message}
                            </Text>
                            <HStack mt={1} gap={2}>
                              <Text fontSize="xs" color={theme.textMuted}>
                                {formatTimeAgo(note.createdAt)}
                              </Text>
                              {note.createdBy && (
                                <Text fontSize="xs" color={theme.textMuted}>
                                  • por {note.createdBy.name}
                                </Text>
                              )}
                            </HStack>
                          </Box>
                          <IconButton
                            aria-label="Deletar"
                            size="xs"
                            variant="ghost"
                            color={theme.textMuted}
                            _hover={{ color: 'red.500', bg: 'red.50' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(note.id);
                            }}
                          >
                            <Trash2 size={12} />
                          </IconButton>
                        </Flex>
                      ))
                    )}
                  </VStack>
                  {notifications.length > 0 && (
                    <Box
                      p={3}
                      bg={theme.bgSecondary}
                      borderTop="1px solid"
                      borderColor={theme.borderLight}
                    >
                      <Text
                        fontSize="xs"
                        color={theme.accent}
                        textAlign="center"
                        fontWeight="medium"
                        cursor="pointer"
                        _hover={{ textDecoration: 'underline' }}
                        onClick={() => handleNavigate('/configuracoes')}
                      >
                        Gerenciar notificações
                      </Text>
                    </Box>
                  )}
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>

          {/* --- PERFIL (MENU v3) --- */}
          <Menu.Root positioning={{ placement: 'bottom-end' }}>
            <Menu.Trigger asChild>
              <HStack
                gap={3}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
                px={2}
                py={1}
                borderRadius="lg"
                transition="all 0.2s"
              >
                <Avatar.Root size="sm" bg={theme.brandPrimary} color="white">
                  <Avatar.Fallback fontWeight="bold">LG</Avatar.Fallback>
                </Avatar.Root>
                <VStack gap={0} align="start" display={{ base: 'none', md: 'flex' }}>
                  <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>
                    Luan G.
                  </Text>
                  <Text fontSize="xs" color={theme.textSecondary}>
                    Administrador
                  </Text>
                </VStack>
              </HStack>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content
                minW="200px"
                bg={theme.bgCard}
                borderRadius="xl"
                boxShadow="xl"
                py={2}
                border="1px solid"
                borderColor={theme.borderColor}
              >
                <Box px={4} py={3} borderBottom="1px solid" borderColor={theme.borderLight}>
                  <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>
                    Luan Gomes
                  </Text>
                  <Text fontSize="xs" color={theme.textSecondary}>
                    luan@fliptelecom.com.br
                  </Text>
                </Box>
                <Menu.Item
                  value="settings"
                  cursor="pointer"
                  _hover={{ bg: theme.bgHover }}
                  px={4}
                  py={3}
                  onClick={() => handleNavigate('/configuracoes')}
                >
                  <HStack gap={3}>
                    <Settings size={16} color={theme.textMuted} />
                    <Text fontSize="sm" color={theme.textPrimary}>
                      Configurações
                    </Text>
                  </HStack>
                </Menu.Item>
                <Box h="1px" bg={theme.borderLight} my={2} />
                <Menu.Item
                  value="logout"
                  color="red.600"
                  cursor="pointer"
                  _hover={{ bg: 'red.50' }}
                  onClick={handleLogout}
                  px={4}
                  py={3}
                >
                  <HStack gap={3}>
                    <LogOut size={16} />
                    <Text fontSize="sm">Sair</Text>
                  </HStack>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </HStack>
      </Flex>
    </Box>
  );
}
