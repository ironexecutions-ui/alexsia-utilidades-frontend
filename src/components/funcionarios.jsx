import React, { useEffect, useState } from "react";
import "./funcionarios.css";
import { API_URL } from "../config";

export default function Funcionarios() {

    const [admins, setAdmins] = useState([]);
    const [funcs, setFuncs] = useState([]);

    useEffect(() => {

        // Agora funciona mesmo sem token
        async function carregar() {
            const resp = await fetch(`${API_URL}/usuarios`);

            const data = await resp.json();

            setAdmins(data.administradores || []);
            setFuncs(data.funcionarios || []);
        }

        carregar();
    }, []);

    return (
        <div className="funcionarios-container">
            <h2 className="funcionarios-titulo">Todos os funcionários Alexsia Utilidades</h2>

            <div className="grupo">
                <h3 className="grupo-titulo">Administradores</h3>

                {admins.length === 0 && <p>Nenhum administrador encontrado.</p>}

                {admins.map(a => (
                    <div key={a.id} className="linha">
                        <span>{a.nome_completo}</span>
                    </div>
                ))}
            </div>

            <div className="grupo">
                <h3 className="grupo-titulo">Funcionários</h3>

                {funcs.length === 0 && <p>Nenhum funcionário encontrado.</p>}

                {funcs.map(f => (
                    <div key={f.id} className="linha">
                        <span>{f.nome_completo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
