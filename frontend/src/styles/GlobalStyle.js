import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background: #10131a;
    color: #fff;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  * {
    box-sizing: border-box;
  }

  ::selection {
    background: #e50914;
    color: #fff;
  }
`;

export default GlobalStyle; 