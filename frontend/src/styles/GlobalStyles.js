import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #0f0f0f;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a2e;
  }

  ::-webkit-scrollbar-thumb {
    background: #6366f1;
    border-radius: 3px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export const theme = {
  colors: {
    primary: "#6366f1",
    success: "#22c55e",
    danger: "#ef4444",
    warning: "#f59e0b",
    background: "#0f0f0f",
    card: "#1a1a2e",
    cardHover: "#1e1e3f",
    border: "#2d2d5e",
    textPrimary: "#ffffff",
    textSecondary: "#94a3b8",
  },
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
  },
};