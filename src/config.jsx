const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

export const API_URL = isLocalhost
    ? "https://alexsia-utilidades-backend.onrender.com" // na verdade é "http://localhost:8000 esse é so para testes na loja
    : "https://alexsia-utilidades-backend.onrender.com";
