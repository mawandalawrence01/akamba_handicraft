// Design System Configuration for Akamba Handicraft Admin
export const designSystem = {
  colors: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Main orange
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    accent: {
      50: '#fef3c7',
      100: '#fde68a',
      200: '#fcd34d',
      300: '#fbbf24',
      400: '#f59e0b',
      500: '#d97706', // Gold accent
      600: '#b45309',
      700: '#92400e',
      800: '#78350f',
      900: '#451a03',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}

// Admin-specific theme configuration
export const adminTheme = {
  sidebar: {
    width: '280px',
    collapsedWidth: '80px',
    backgroundColor: designSystem.colors.secondary[900],
    textColor: designSystem.colors.secondary[100],
    activeColor: designSystem.colors.primary[500],
    hoverColor: designSystem.colors.secondary[800],
  },
  header: {
    height: '72px',
    backgroundColor: '#ffffff',
    borderColor: designSystem.colors.secondary[200],
    shadow: designSystem.shadows.sm,
  },
  content: {
    backgroundColor: designSystem.colors.secondary[50],
    padding: designSystem.spacing.xl,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: designSystem.borderRadius.lg,
    shadow: designSystem.shadows.md,
    padding: designSystem.spacing.xl,
  },
}

// Utility functions for consistent styling
export const getAdminStyles = () => ({
  sidebar: {
    width: adminTheme.sidebar.width,
    backgroundColor: adminTheme.sidebar.backgroundColor,
    color: adminTheme.sidebar.textColor,
  },
  header: {
    height: adminTheme.header.height,
    backgroundColor: adminTheme.header.backgroundColor,
    borderBottom: `1px solid ${adminTheme.header.borderColor}`,
    boxShadow: adminTheme.header.shadow,
  },
  content: {
    backgroundColor: adminTheme.content.backgroundColor,
    padding: adminTheme.content.padding,
  },
  card: {
    backgroundColor: adminTheme.card.backgroundColor,
    borderRadius: adminTheme.card.borderRadius,
    boxShadow: adminTheme.card.shadow,
    padding: adminTheme.card.padding,
  },
})

// Animation configurations
export const animations = {
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
}
