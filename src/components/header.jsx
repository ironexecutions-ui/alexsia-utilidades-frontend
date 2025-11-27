import React, { useState, useEffect, useRef } from "react";
import "./header.css";
import Logo from "./logo.jpg";
import { API_URL } from "../config";

export default function Header() {

    const [modoCodigo, setModoCodigo] = useState(true);

    const [codigo, setCodigo] = useState("");
    const inputCodigoRef = useRef(null);

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    useEffect(() => {
        if (modoCodigo && inputCodigoRef.current) {
            inputCodigoRef.current.focus();
        }
    }, [modoCodigo]);

    async function loginPorCodigo() {
        if (!codigo.trim()) return;

        setCarregando(true);
        setSucesso(false);

        try {
            const resp = await fetch(`${API_URL}/login-codigo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codigo: codigo.trim() })
            });

            const data = await resp.json();

            setCarregando(false);

            if (resp.status !== 200) {
                alert(data.detail || "Código inválido");
                return;
            }

            setSucesso(true);

            setTimeout(() => {
                localStorage.setItem("token", data.token);
                window.location.href = "/perfil";
            }, 600);

        } catch (err) {
            setCarregando(false);
            console.log("Erro:", err);
            alert("Não foi possível conectar ao servidor");
        }
    }

    function detectarEnter(event) {
        if (event.key === "Enter") {
            loginPorCodigo();
        }
    }

    async function enviarLogin(e) {
        e.preventDefault();

        try {
            const resp = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    username: email.trim(),
                    password: senha.trim()
                })
            });

            const data = await resp.json();

            if (resp.status !== 200) {
                alert(data.detail);
                return;
            }

            localStorage.setItem("token", data.token);
            window.location.href = "/perfil";

        } catch (err) {
            console.log("Erro:", err);
            alert("Erro ao conectar com servidor");
        }
    }

    return (
        <header className="header-container">
            <img src={Logo} alt="Logo" />
            <h1 className="header-titulo">Alexsia Utilidades</h1>

            {modoCodigo ? (
                <div className="codigo-area">
                    <input
                        ref={inputCodigoRef}
                        type="text"
                        placeholder="Passe o código de barras aqui"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        onKeyDown={detectarEnter}
                        autoComplete="off"
                        className={`${carregando ? "input-loading" : ""} ${sucesso ? "input-sucesso" : ""}`}
                    />

                    <button
                        className="btn-alternar"
                        onClick={() => setModoCodigo(false)}
                    >
                        Entrar com email e senha
                    </button>
                </div>
            ) : (
                <form className="header-form" onSubmit={enviarLogin}>
                    <input
                        type="email"
                        placeholder="Email do funcionário"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />

                    <button type="submit">Entrar</button>

                    <button
                        type="button"
                        className="btn-voltar-codigo"
                        onClick={() => setModoCodigo(true)}
                    >
                        Voltar para código de barras
                    </button>
                </form>
            )}
        </header>
    );
}
