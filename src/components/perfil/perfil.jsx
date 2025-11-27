import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./perfil.css";

import PainelComercial from "./components/painelcomercial";
import Inventario from "./components/inventario";
import Desempenho from "./components/desempenho";
import ControleFuncionarios from "./components/controlefuncionarios";
import LogoutModal from "./components/logoutmodal";
import { VendaProvider } from "./components/comercio/vendaprovider";

export default function Perfil() {

    const [dados, setDados] = useState(null);
    const [aba, setAba] = useState("comercial");
    const [mostrarLogout, setMostrarLogout] = useState(false);
    const [semToken, setSemToken] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setSemToken(true);
            return;
        }

        fetch(`${API_URL}/perfil`, {
            headers: { Authorization: token }
        })
            .then(r => r.json())
            .then(d => setDados(d))
            .catch(() => {
                localStorage.removeItem("token");
                setSemToken(true);
            });
    }, []);

    if (semToken) {
        return (
            <div
                style={{
                    width: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "linear-gradient(135deg, #0f3d0f, #1d5c1d)",
                    padding: "30px",
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif"
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        padding: "35px",
                        maxWidth: "420px",
                        width: "100%",
                        borderRadius: "16px",
                        border: "3px solid #a60000",
                        boxShadow: "0 0 18px rgba(0,0,0,0.25)"
                    }}
                >
                    <h1
                        style={{
                            fontSize: "26px",
                            color: "#c9a63b",
                            marginBottom: "12px",
                            fontWeight: "700",
                            letterSpacing: "1px"
                        }}
                    >
                        Nenhuma conta logada
                    </h1>

                    <p
                        style={{
                            fontSize: "17px",
                            color: "#333",
                            lineHeight: "1.5",
                            marginBottom: "24px"
                        }}
                    >
                        Não encontramos nenhuma conta ativa. Faça login para continuar usando o painel.
                    </p>

                    <button
                        onClick={() => window.location.href = "/"}
                        style={{
                            padding: "12px 22px",
                            fontSize: "16px",
                            background: "#d4af37",
                            border: "none",
                            borderRadius: "8px",
                            color: "#111",
                            cursor: "pointer",
                            fontWeight: "600",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            transition: "0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                    >
                        Ir para o início
                    </button>
                </div>
            </div>
        );
    }



    if (!dados) {
        return (
            <h2 style={{ textAlign: "center", marginTop: "40px" }}>
                Carregando...
            </h2>
        );
    }

    const isAdmin = dados.funcao === "admin";

    function logout() {
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    return (
        <div className="perfil-container">

            <button
                className="botao-logout"
                onClick={() => setMostrarLogout(true)}
            >
                Sair
            </button>
            <div className="topo-perfil">

                <h1>Bem vindo, {dados.nome_completo}</h1>

                <div className="perfil-menu">

                    <button
                        className={aba === "comercial" ? "ativo" : ""}
                        onClick={() => setAba("comercial")}
                    >
                        Painel Comercial
                    </button>

                    {isAdmin && (
                        <>
                            <button
                                className={aba === "inventario" ? "ativo" : ""}
                                onClick={() => setAba("inventario")}
                            >
                                Inventário
                            </button>

                            <button
                                className={aba === "desempenho" ? "ativo" : ""}
                                onClick={() => setAba("desempenho")}
                            >
                                Desempenho Comercial
                            </button>

                            <button
                                className={aba === "funcionarios" ? "ativo" : ""}
                                onClick={() => setAba("funcionarios")}
                            >
                                Controle de Funcionários
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="perfil-conteudo">
                {aba === "comercial" && (
                    <VendaProvider>
                        <div className="painel-comercial-wrapper">
                            <PainelComercial />
                        </div>
                    </VendaProvider>
                )}

                {aba === "inventario" && isAdmin && <Inventario />}
                {aba === "desempenho" && isAdmin && <Desempenho />}
                {aba === "funcionarios" && isAdmin && <ControleFuncionarios />}
            </div>

            {mostrarLogout && (
                <LogoutModal
                    fechar={() => setMostrarLogout(false)}
                    confirmar={logout}
                />
            )}
        </div>
    );
}
