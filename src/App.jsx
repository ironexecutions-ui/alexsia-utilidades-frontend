import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Rodape from "./components/rodape";
import Perfil from "./components/perfil/perfil";
import Funcionarios from "./components/funcionarios";

export default function App() {

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.titulo}>Acesso bloqueado</h1>
          <p style={styles.texto}>
            Este site não está liberado para celulares, abra no computador para continuar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Funcionarios />
              <Rodape />
            </>
          }
        />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f3d0f, #1d5c1d)", // verde elegante
    padding: "30px"
  },
  card: {
    background: "#fff",
    padding: "35px",
    borderRadius: "16px",
    maxWidth: "420px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 0 18px rgba(0,0,0,0.25)",
    border: "3px solid #a60000" // vermelho profundo
  },
  titulo: {
    fontSize: "28px",
    marginBottom: "12px",
    color: "#c9a63b", // dourado
    fontWeight: "700",
    letterSpacing: "1px"
  },
  texto: {
    fontSize: "18px",
    color: "#333",
    lineHeight: "1.45"
  }
};
