import React, { useState } from "react";
import "./desempenho.css";

import MaioresMenores from "./desempenho/maioresmenores";
import Historico from "./desempenho/historico";
import Grafico from "./desempenho/grafico";
import FechamentoDiario from "./desempenho/fechamentodiario";

export default function Desempenho() {

    const [aba, setAba] = useState("maiores");

    return (
        <div className="desempenho-container">

            <h2>Desempenho Comercial</h2>

            <div className="desempenho-botoes">
                <button
                    className={aba === "maiores" ? "ativo" : ""}
                    onClick={() => setAba("maiores")}
                >
                    Maiores e Menores Vendidos
                </button>

                <button
                    className={aba === "historico" ? "ativo" : ""}
                    onClick={() => setAba("historico")}
                >
                    Histórico
                </button>

                <button
                    className={aba === "grafico" ? "ativo" : ""}
                    onClick={() => setAba("grafico")}
                >
                    Gráficos
                </button>

                <button
                    className={aba === "fechamento" ? "ativo" : ""}
                    onClick={() => setAba("fechamento")}
                >
                    Fechamento Diário
                </button>
            </div>

            <div className="desempenho-conteudo">
                {aba === "maiores" && <MaioresMenores />}
                {aba === "historico" && <Historico />}
                {aba === "grafico" && <Grafico />}
                {aba === "fechamento" && <FechamentoDiario />}
                {/* Quando o arquivo existir, troque por <FechamentoDiario /> */}
            </div>

        </div>
    );
}
