/**
 * Centralized Design System Colors & Theme Constants
 * Single source of truth for all brand & UI colors across MyGuard Platform.
 */

export const THEME_COLORS = {
  // Brand Core Colors
  brandBlue: '#0066FF',
  brandBlueHover: '#0052CC',
  brandPurple: '#9333EA',
  brandPurpleHover: '#7E22CE',
  brandGreen: '#10B981', // Success / Emerald Green
  brandTeal: '#0D9488',  // SİMA brand teal
  deepNavy: '#100028',

  // Surface & Layout
  surface: '#FAFAFA',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F3F4F6',
  surfaceContainer: '#E5E7EB',
  surfaceContainerHigh: '#D1D5DB',
  surfaceContainerHighest: '#9CA3AF',
  onSurface: '#100028',
  onSurfaceVariant: '#44464F',
  outline: '#C4C6CF',
  outlineVariant: '#E0E2EC',
  inverseSurface: '#2F3036',

  // Semantic Roles
  primary: '#0066FF',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E0E7FF',
  onPrimaryContainer: '#001848',

  secondary: '#9333EA',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#F5E7FF',
  onSecondaryContainer: '#2D004E',

  tertiary: '#006874',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#9EEFFD',
  onTertiaryContainer: '#001F24',

  success: '#10B981',
  onSuccess: '#FFFFFF',
  successContainer: '#D1FAE5',
  onSuccessContainer: '#047857',

  warning: '#F59E0B',
  onWarning: '#FFFFFF',
  warningContainer: '#FEF3C7',
  onWarningContainer: '#B45309',

  error: '#EF4444',
  onError: '#FFFFFF',
  errorContainer: '#FEE2E2',
  onErrorContainer: '#991B1B',
} as const;

export type ThemeColorKey = keyof typeof THEME_COLORS;

/**
 * Utility helper to convert hex colors to RGBA format with alpha transparency
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
