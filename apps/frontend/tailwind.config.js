/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
      extend: {
          "colors": {
              "primary": "#E02B45",
              "on-primary": "#ffffff",
              "primary-container": "#FFE4E8",
              "on-primary-container": "#4A0011",
              "inverse-primary": "#FFB3BC",
              "primary-fixed": "#FFD9DE",
              "on-primary-fixed": "#3E000F",
              "primary-fixed-dim": "#FFB3BC",
              "on-primary-fixed-variant": "#71001E",
              
              "secondary": "#00A59C",
              "on-secondary": "#ffffff",
              "secondary-container": "#E0F7F6",
              "on-secondary-container": "#003633",
              "secondary-fixed": "#A1F9F1",
              "on-secondary-fixed": "#00201E",
              "secondary-fixed-dim": "#84DDD6",
              "on-secondary-fixed-variant": "#00504B",

              "tertiary": "#8d4b00",
              "on-tertiary": "#ffffff",
              "tertiary-container": "#ffdcc3",
              "on-tertiary-container": "#2f1500",

              "error": "#B3261E",
              "on-error": "#ffffff",
              "error-container": "#ffdad6",
              "on-error-container": "#410002",

              "surface": "#f9f9ff",
              "on-surface": "#191b23",
              "surface-variant": "#e1e2ec",
              "on-surface-variant": "#424754",
              "surface-container-lowest": "#ffffff",
              "surface-container-low": "#f2f3fd",
              "surface-container": "#ecedf7",
              "surface-container-high": "#e6e7f2",
              "surface-container-highest": "#e1e2ec",
              "inverse-surface": "#2e3038",
              "inverse-on-surface": "#eff0fa",
              "outline": "#727785",
              "outline-variant": "#c2c6d6",
              "background": "#f9f9ff",
              "on-background": "#191b23",
              "surface-bright": "#f9f9ff",
              "surface-dim": "#d8d9e3",
              "surface-tint": "#E02B45"
          },
          "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
          },
          "spacing": {
              "base": "8px",
              "md": "16px",
              "sm": "12px",
              "margin-mobile": "16px",
              "xs": "4px",
              "container-max": "1200px",
              "gutter": "16px",
              "margin-desktop": "24px",
              "xl": "32px",
              "lg": "24px"
          },
          "fontFamily": {
              "headline-sm": ["Inter"],
              "body-lg": ["Inter"],
              "label-caps": ["Inter"],
              "display-lg": ["Inter"],
              "dosage-label": ["JetBrains Mono"],
              "dosage-display": ["JetBrains Mono"],
              "headline-md": ["Inter"],
              "body-md": ["Inter"],
              "body-sm": ["Inter"]
          },
          "fontSize": {
              "headline-sm": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
              "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
              "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
              "display-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
              "dosage-label": ["16px", {"lineHeight": "24px", "fontWeight": "500"}],
              "dosage-display": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
              "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
              "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
              "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}]
          }
      }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
