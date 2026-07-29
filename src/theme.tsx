import { createContext, type ReactNode, useContext } from 'react'

export const THEME_MODES = [
  'auto',
  'light',
  'dark',
  'dracula',
  'nord',
  'catppuccin',
  'tokyo',
  'gruvbox',
  'rosepine',
  'matrix',
  'cyberpunk',
] as const

export type ThemeMode = (typeof THEME_MODES)[number]

export type Theme = {
  mode: ThemeMode

  /** Primary foreground */
  primary?: string

  /** Secondary / muted text */
  secondary?: string

  /** Success color */
  success?: string

  /** Warning color */
  warning?: string

  /** Error color */
  error?: string

  /** Information color */
  info?: string

  /** Gray text */
  gray?: string

  /** Terminal background */
  background?: string

  /** Dark surface */
  dark?: string

  dimSecondary: boolean

  inverseButton: boolean
}

const themes: Record<ThemeMode, Theme> = {
  auto: {
    mode: 'auto',
    primary: undefined,
    secondary: undefined,
    success: undefined,
    warning: undefined,
    error: undefined,
    info: undefined,
    gray: undefined,
    dark: undefined,
    background: undefined,
    dimSecondary: true,
    inverseButton: true,
  },

  light: {
    mode: 'light',
    primary: '#18181b',
    secondary: '#52525b',
    success: '#16a34a',
    warning: '#ca8a04',
    error: '#dc2626',
    info: '#2563eb',
    gray: '#71717a',
    dark: '#ffffff',
    background: '#ffffff',
    dimSecondary: false,
    inverseButton: false,
  },

  dark: {
    mode: 'dark',
    primary: '#ffffff',
    secondary: '#a1a1aa',
    success: '#22c55e',
    warning: '#facc15',
    error: '#ef4444',
    info: '#60a5fa',
    gray: '#71717a',
    dark: '#18181b',
    background: '#18181b',
    dimSecondary: false,
    inverseButton: false,
  },

  dracula: {
    mode: 'dracula',
    primary: '#f8f8f2',
    secondary: '#bd93f9',
    success: '#50fa7b',
    warning: '#f1fa8c',
    error: '#ff5555',
    info: '#8be9fd',
    gray: '#6272a4',
    dark: '#282a36',
    background: '#282a36',
    dimSecondary: false,
    inverseButton: false,
  },

  nord: {
    mode: 'nord',
    primary: '#eceff4',
    secondary: '#88c0d0',
    success: '#a3be8c',
    warning: '#ebcb8b',
    error: '#bf616a',
    info: '#81a1c1',
    gray: '#4c566a',
    dark: '#2e3440',
    background: '#2e3440',
    dimSecondary: false,
    inverseButton: false,
  },

  catppuccin: {
    mode: 'catppuccin',
    primary: '#cdd6f4',
    secondary: '#89b4fa',
    success: '#a6e3a1',
    warning: '#f9e2af',
    error: '#f38ba8',
    info: '#74c7ec',
    gray: '#6c7086',
    dark: '#1e1e2e',
    background: '#1e1e2e',
    dimSecondary: false,
    inverseButton: false,
  },

  tokyo: {
    mode: 'tokyo',
    primary: '#c0caf5',
    secondary: '#7aa2f7',
    success: '#9ece6a',
    warning: '#e0af68',
    error: '#f7768e',
    info: '#7dcfff',
    gray: '#565f89',
    dark: '#1a1b26',
    background: '#1a1b26',
    dimSecondary: false,
    inverseButton: false,
  },

  gruvbox: {
    mode: 'gruvbox',
    primary: '#ebdbb2',
    secondary: '#d79921',
    success: '#b8bb26',
    warning: '#fabd2f',
    error: '#fb4934',
    info: '#83a598',
    gray: '#928374',
    dark: '#282828',
    background: '#282828',
    dimSecondary: false,
    inverseButton: false,
  },

  rosepine: {
    mode: 'rosepine',
    primary: '#e0def4',
    secondary: '#c4a7e7',
    success: '#9ccfd8',
    warning: '#f6c177',
    error: '#eb6f92',
    info: '#31748f',
    gray: '#6e6a86',
    dark: '#191724',
    background: '#191724',
    dimSecondary: false,
    inverseButton: false,
  },

  matrix: {
    mode: 'matrix',
    primary: '#00ff41',
    secondary: '#00cc33',
    success: '#00ff41',
    warning: '#ffff00',
    error: '#ff4444',
    info: '#ff4444',
    gray: '#008f11',
    dark: '#000000',
    background: '#000000',
    dimSecondary: false,
    inverseButton: false,
  },

  cyberpunk: {
    mode: 'cyberpunk',
    primary: '#00f7ff',
    secondary: '#ff00c8',
    success: '#39ff14',
    warning: '#ffd300',
    error: '#ff3131',
    info: '#00bfff',
    gray: '#7b2cbf',
    dark: '#08080f',
    background: '#08080f',
    dimSecondary: false,
    inverseButton: false,
  },
}

const ThemeContext = createContext<Theme>(themes.auto)

export function themeFor(mode: ThemeMode): Theme {
  return themes[mode]
}

export function ThemeProvider({
  mode,
  children,
}: {
  mode: ThemeMode
  children: ReactNode
}) {
  return (
    <ThemeContext.Provider value={themeFor(mode)}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): Theme {
  return useContext(ThemeContext)
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return (
    typeof value === 'string' &&
    (THEME_MODES as readonly string[]).includes(value)
  )
}

export function nextThemeMode(mode: ThemeMode): ThemeMode {
  const index = THEME_MODES.indexOf(mode)
  return THEME_MODES[(index + 1) % THEME_MODES.length]
}
