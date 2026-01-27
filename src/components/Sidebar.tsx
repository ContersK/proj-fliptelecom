'use client';

import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Image,
  Spacer,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useFlipTheme } from '@/hooks/useFlipTheme';

const MENU_ITEMS = [
  { name: 'Principal', icon: LayoutDashboard, path: '/' },
  { name: 'Comissões', icon: FileText, path: '/comissoes' },
  { name: 'Funcionários', icon: Users, path: '/funcionarios' },
  { name: 'Configurações', icon: Settings, path: '/configuracoes' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const theme = useFlipTheme();

  function handleCollapse() {
    onToggle(!isCollapsed);
  }

  return (
    <Box
      as="aside"
      w={isCollapsed ? '80px' : '280px'}
      h="100vh"
      bg={
        theme.colorMode === 'dark'
          ? 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)'
          : 'linear-gradient(180deg, #0052cc 0%, #003d99 100%)'
      }
      color="white"
      position="fixed"
      left={0}
      top={0}
      zIndex={100}
      transition="width 0.3s ease"
      boxShadow="4px 0 15px rgba(0, 0, 0, 0.15)"
      display={{ base: 'none', md: 'block' }}
    >
      <VStack h="full" align="stretch" gap={0}>
        {/* CABEÇALHO - LOGO */}
        <Box
          bg="white"
          m={isCollapsed ? 2 : 4}
          mt={4}
          borderRadius="2xl"
          p={isCollapsed ? 3 : 4}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 8px 32px rgba(0,0,0,0.25)"
          transition="all 0.3s ease"
        >
          <Image
            src="/logo-flip.png"
            alt="Flip Telecom"
            h={isCollapsed ? '35px' : '55px'}
            w="auto"
            objectFit="contain"
            transition="height 0.3s ease"
          />
        </Box>

        {/* BOTÃO DE CONTROLE */}
        <Box position="absolute" right="-12px" top={isCollapsed ? '75px' : '120px'} zIndex={110}>
          <IconButton
            aria-label="Toggle Sidebar"
            onClick={handleCollapse}
            size="xs"
            rounded="full"
            bg={theme.bgNavbar}
            color={theme.brandPrimary}
            border="1px solid"
            borderColor={theme.borderColor}
            shadow="md"
            _hover={{ bg: theme.bgHover, transform: 'scale(1.05)' }}
            transition="all 0.2s"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </IconButton>
        </Box>

        {/* MENU */}
        <VStack align="stretch" gap={1} p={isCollapsed ? 2 : 4} mt={4}>
          {!isCollapsed && (
            <Text fontSize="xs" fontWeight="bold" opacity={0.5} pl={4} mb={2} letterSpacing="wider">
              MENU
            </Text>
          )}

          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;

            const LinkContent = (
              <HStack
                px={isCollapsed ? 0 : 4}
                justify={isCollapsed ? 'center' : 'flex-start'}
                h="48px"
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.2s"
                bg={isActive ? 'rgba(255,255,255,0.2)' : 'transparent'}
                color="white"
                fontWeight={isActive ? 'semibold' : 'normal'}
                _hover={{ bg: 'rgba(255,255,255,0.15)', transform: 'translateX(4px)' }}
                position="relative"
                w="full"
              >
                {isActive && (
                  <Box
                    position="absolute"
                    left={0}
                    top="50%"
                    transform="translateY(-50%)"
                    w="4px"
                    h="60%"
                    bg="white"
                    borderRadius="full"
                  />
                )}
                <Icon as={item.icon} boxSize={5} />

                {!isCollapsed && (
                  <Text fontSize="sm" whiteSpace="nowrap" ml={3}>
                    {item.name}
                  </Text>
                )}
              </HStack>
            );

            return (
              <Link
                href={item.path}
                key={item.path}
                style={{ textDecoration: 'none', width: '100%' }}
              >
                {isCollapsed ? (
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Box>{LinkContent}</Box>
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                      <Tooltip.Content
                        bg="gray.800"
                        color="white"
                        px={3}
                        py={2}
                        rounded="lg"
                        fontSize="sm"
                        shadow="lg"
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
          {!isCollapsed && (
            <Text fontSize="10px" textAlign="center" opacity={0.5} letterSpacing="wide">
              v1.0
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
