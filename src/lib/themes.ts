// Theme definitions for MyProfile
// Each theme has unique colors, border styles, and effects

export interface ThemeEffects {
    glowIntensity: number;      // 0-100, how strong the glow effect is
    brightnessMultiplier: number; // 1.0-1.5, enhances color vibrancy
    animationsEnabled: boolean;
    gradientAnimated: boolean;
    linkHoverScale: number;     // 1.00-1.05 scale on hover
}

export interface Theme {
    id: string;
    name: string;
    description: string;
    isPremium: boolean;
    colors: {
        primary: string;      // RGB values like "236 72 153"
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
    };
    borderRadius: 'rounded' | 'sharp' | 'pill';
    hasGlow: boolean;
    // Pro-exclusive enhanced effects
    proEffects: ThemeEffects;
}

export const THEMES: Theme[] = [
    {
        id: "default",
        name: "Padrão",
        description: "Cyan e Magenta vibrantes",
        isPremium: false,
        colors: {
            primary: "236 72 153",      // pink-500
            accent: "6 182 212",        // cyan-500
            background: "3 7 18",
            surface: "15 23 42",
            text: "248 250 252",
            textSecondary: "148 163 184",
        },
        borderRadius: "rounded",
        hasGlow: true,
        proEffects: {
            glowIntensity: 30,
            brightnessMultiplier: 1.0,
            animationsEnabled: false,
            gradientAnimated: false,
            linkHoverScale: 1.02,
        },
    },
    {
        id: "influencer",
        name: "Influencer",
        description: "Gold e Black luxuoso",
        isPremium: true,
        colors: {
            primary: "234 179 8",        // yellow-500 (gold)
            accent: "251 191 36",        // amber-400
            background: "0 0 0",
            surface: "24 24 27",         // zinc-900
            text: "250 250 250",
            textSecondary: "161 161 170", // zinc-400
        },
        borderRadius: "rounded",
        hasGlow: true,
        proEffects: {
            glowIntensity: 80,
            brightnessMultiplier: 1.3,
            animationsEnabled: true,
            gradientAnimated: true,
            linkHoverScale: 1.05,
        },
    },
    {
        id: "creator",
        name: "Produtor de Conteúdo",
        description: "Blue e Purple criativo",
        isPremium: true,
        colors: {
            primary: "99 102 241",       // indigo-500
            accent: "168 85 247",        // purple-500
            background: "15 23 42",      // slate-900
            surface: "30 41 59",         // slate-800
            text: "248 250 252",
            textSecondary: "148 163 184",
        },
        borderRadius: "rounded",
        hasGlow: true,
        proEffects: {
            glowIntensity: 70,
            brightnessMultiplier: 1.2,
            animationsEnabled: true,
            gradientAnimated: true,
            linkHoverScale: 1.04,
        },
    },
    {
        id: "streamer",
        name: "Streamer",
        description: "Purple e Green neon gaming",
        isPremium: true,
        colors: {
            primary: "147 51 234",       // purple-600
            accent: "34 197 94",         // green-500
            background: "9 9 11",        // zinc-950
            surface: "24 24 27",         // zinc-900
            text: "250 250 250",
            textSecondary: "161 161 170",
        },
        borderRadius: "sharp",
        hasGlow: true,
        proEffects: {
            glowIntensity: 100,
            brightnessMultiplier: 1.4,
            animationsEnabled: true,
            gradientAnimated: true,
            linkHoverScale: 1.05,
        },
    },
    {
        id: "minimalist",
        name: "Minimalista",
        description: "Clean e elegante",
        isPremium: true,
        colors: {
            primary: "82 82 91",         // zinc-600
            accent: "39 39 42",          // zinc-800
            background: "250 250 250",   // zinc-50 (light mode)
            surface: "244 244 245",      // zinc-100
            text: "24 24 27",            // zinc-900
            textSecondary: "63 63 70",   // zinc-700 (Darker for better contrast)
        },
        borderRadius: "pill",
        hasGlow: false,
        proEffects: {
            glowIntensity: 0,
            brightnessMultiplier: 1.0,
            animationsEnabled: true,
            gradientAnimated: false,
            linkHoverScale: 1.03,
        },
    },
    {
        id: "sunset",
        name: "Sunset",
        description: "Orange e Pink tons quentes",
        isPremium: true,
        colors: {
            primary: "249 115 22",       // orange-500
            accent: "244 63 94",         // rose-500
            background: "28 25 23",      // stone-900
            surface: "41 37 36",         // stone-800
            text: "250 250 249",         // stone-50
            textSecondary: "168 162 158", // stone-400
        },
        borderRadius: "rounded",
        hasGlow: true,
        proEffects: {
            glowIntensity: 75,
            brightnessMultiplier: 1.25,
            animationsEnabled: true,
            gradientAnimated: true,
            linkHoverScale: 1.04,
        },
    },
    {
        id: "hyperliquid",
        name: "Hyperliquid",
        description: "Neon Mint e Deep Dark",
        isPremium: true,
        colors: {
            primary: "151 252 228",      // #97FCE4 (Neon Mint)
            accent: "20 184 166",        // Teal-500 (complementary)
            background: "15 26 31",      // #0F1A1F (Deep Dark Blue)
            surface: "23 69 63",         // #17453F (Dark Teal)
            text: "236 254 255",         // Cyan-50
            textSecondary: "148 163 184",
        },
        borderRadius: "sharp",
        hasGlow: true,
        proEffects: {
            glowIntensity: 90,
            brightnessMultiplier: 1.3,
            animationsEnabled: true,
            gradientAnimated: true,
            linkHoverScale: 1.05,
        },
    },
    {
        id: "barbie",
        name: "Barbie",
        description: "Pink World",
        isPremium: true,
        colors: {
            primary: "236 0 140",        // Hot Pink (Borders/Sparkles)
            accent: "255 20 147",        // Deep Pink (Sparkles var)
            background: "246 122 169",   // #F67AA9 (Requested Background)
            surface: "246 122 169",      // Same as BG for clean look, or slightly darker "219 96 148"
            text: "255 255 255",         // White text works well on this pink
            textSecondary: "253 224 235", // Light pink text
        },
        borderRadius: "rounded",
        hasGlow: true,
        proEffects: {
            glowIntensity: 85,
            brightnessMultiplier: 1.1, // Reduced slightly as BG is bright
            animationsEnabled: true,
            gradientAnimated: true,
            linkHoverScale: 1.05,
        },
    },
];

export function getThemeById(id: string): Theme | undefined {
    return THEMES.find(theme => theme.id === id);
}

export function getDefaultTheme(): Theme {
    return THEMES[0];
}

// Generate CSS variables for a theme
export function getThemeCSSVariables(theme: Theme): Record<string, string> {
    return {
        '--color-primary': theme.colors.primary,
        '--color-accent': theme.colors.accent,
        '--color-background': theme.colors.background,
        '--color-surface': theme.colors.surface,
        '--color-text-primary': theme.colors.text,
        '--color-text-secondary': theme.colors.textSecondary,
    };
}
