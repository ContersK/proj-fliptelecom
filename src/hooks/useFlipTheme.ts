'use client';

import { useColorMode } from '@/components/ui/color-mode';

// Paleta de cores baseada na Flip Telecom
// Tema Light: Branco com detalhes em azul Flip
// Tema Dark: Preto/Cinza escuro padrão

export const flipColors = {
  // Azul principal da marca Flip
  brand: {
    50: '#e6f0ff',
    100: '#b3d1ff',
    200: '#80b3ff',
    300: '#4d94ff',
    400: '#1a75ff',
    500: '#0066FF', // Azul Flip principal
    600: '#0052cc',
    700: '#003d99',
    800: '#002966',
    900: '#001433',
  },
  // Cinza/Preto para dark mode padrão
  dark: {
    50: '#f7fafc',
    100: '#edf2f7',
    200: '#e2e8f0',
    300: '#cbd5e0',
    400: '#a0aec0',
    500: '#718096',
    600: '#4a5568',
    700: '#2d3748', // Fundo dark secundário
    800: '#1a202c', // Fundo dark principal
    900: '#171923', // Fundo dark mais escuro
  },
};

export interface ThemeColors {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  bgSidebar: string;
  bgNavbar: string;
  bgHover: string;
  bgInput: string;

  // Textos
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Bordas
  borderColor: string;
  borderLight: string;

  // Marca
  brandPrimary: string;
  brandSecondary: string;
  brandHover: string;

  // Accent colors
  accent: string;
  accentHover: string;

  // Status
  success: string;
  warning: string;
  error: string;
  info: string;

  // Cards e shadows
  cardShadow: string;

  // Menu ativo
  menuActiveBg: string;
  menuActiveText: string;
}

export const lightTheme: ThemeColors = {
  // Backgrounds - Branco com toques sutis
  bgPrimary: '#f8fafc', // Quase branco
  bgSecondary: '#f1f5f9', // Cinza muito claro
  bgCard: '#FFFFFF',
  bgSidebar: '#0052cc', // Azul Flip mais escuro e intenso
  bgNavbar: '#FFFFFF',
  bgHover: '#e2e8f0',
  bgInput: '#FFFFFF',

  // Textos
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  textInverse: '#FFFFFF',

  // Bordas
  borderColor: '#e2e8f0', // Borda cinza claro
  borderLight: '#f1f5f9',

  // Marca - Azul Flip
  brandPrimary: '#0066FF',
  brandSecondary: '#0052cc',
  brandHover: '#003d99',

  // Accent
  accent: '#0066FF',
  accentHover: '#0052cc',

  // Status
  success: '#38A169',
  warning: '#DD6B20',
  error: '#E53E3E',
  info: '#3182CE',

  // Cards
  cardShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',

  // Menu
  menuActiveBg: 'rgba(255, 255, 255, 0.2)',
  menuActiveText: '#FFFFFF',
};

export const darkTheme: ThemeColors = {
  // Backgrounds - Preto/Cinza escuro padrão
  bgPrimary: '#121212', // Preto suave
  bgSecondary: '#1e1e1e', // Cinza escuro
  bgCard: '#252525', // Card cinza
  bgSidebar: '#0a0a0a', // Sidebar preto
  bgNavbar: '#1a1a1a', // Navbar cinza escuro
  bgHover: '#333333', // Hover cinza
  bgInput: '#1e1e1e', // Input cinza escuro

  // Textos - Branco e tons claros
  textPrimary: '#FFFFFF',
  textSecondary: '#b3b3b3',
  textMuted: '#808080',
  textInverse: '#121212',

  // Bordas
  borderColor: '#404040', // Borda cinza
  borderLight: '#333333',

  // Marca - Azul Flip mais brilhante para contraste
  brandPrimary: '#3399ff', // Azul mais claro para dark mode
  brandSecondary: '#66b3ff',
  brandHover: '#0066FF',

  // Accent
  accent: '#3399ff',
  accentHover: '#0066FF',

  // Status
  success: '#4ade80',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',

  // Cards
  cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',

  // Menu
  menuActiveBg: 'rgba(51, 153, 255, 0.2)',
  menuActiveText: '#3399ff',
};

export function useFlipTheme(): ThemeColors & {
  colorMode: 'light' | 'dark';
  toggleColorMode: () => void;
} {
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = colorMode === 'dark' ? darkTheme : lightTheme;

  return {
    ...theme,
    colorMode,
    toggleColorMode,
  };
}

// Helper para obter valor baseado no tema
export function useThemeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? dark : light;
}
