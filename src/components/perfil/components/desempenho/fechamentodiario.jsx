import React, { useEffect, useState } from "react";
import "./fechamentodiario.css";
import { API_URL } from "../../../../config";

export default function FechamentoDiario() {

    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [hora, setHora] = useState("");

    useEffect(() => {

        const timer = setInterval(() => {
            const agora = new Date();
            const opcoes = { timeZone: "America/Sao_Paulo", hour12: false };
            const h = agora.toLocaleTimeString("pt-BR", opcoes);
            setHora(h);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {

        async function carregar() {
            try {

                const token = localStorage.getItem("token");

                const resposta = await fetch(`${API_URL}/fechamento/20dias`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const json = await resposta.json();
                setDados(json);
                setCarregando(false);

            } catch (error) {
                console.error("Erro ao carregar fechamento");
                setCarregando(false);
            }
        }

        carregar();

    }, []);

    if (carregando) {
        return (
            <div className="fd-box">
                <p className="fd-carregando">Carregando dados do dia...</p>
            </div>
        );
    }

    if (!dados) {
        return (
            <div className="fd-box">
                <p className="fd-erro">Não foi possível carregar o fechamento</p>
            </div>
        );
    }

    function calcularDiferenca(atual, anterior) {

        if (anterior === null || anterior === undefined) {
            return {
                texto: "",
                classe: ""
            };
        }

        const diferenca = atual - anterior;

        if (diferenca > 0) {
            return {
                texto: `R$ ${diferenca.toFixed(2)} a mais que o dia anterior`,
                classe: "positivo"
            };
        }

        if (diferenca < 0) {
            return {
                texto: `R$ ${(diferenca * -1).toFixed(2)} a menos que o dia anterior`,
                classe: "negativo"
            };
        }

        return {
            texto: "Mesmo valor do dia anterior",
            classe: "neutro"
        };
    }

    const totalAtual = dados.diaAtual.total;
    const totalAnterior = dados.ultimos20dias.length > 1 ? dados.ultimos20dias[1].total : null;

    const infoAtual = calcularDiferenca(totalAtual, totalAnterior);
    function formatarDataExtenso(dataISO) {
        if (!dataISO) return "";

        const partes = dataISO.split("-");
        const ano = partes[0];
        const mes = parseInt(partes[1]);
        const dia = parseInt(partes[2]);

        const meses = [
            "janeiro",
            "fevereiro",
            "março",
            "abril",
            "maio",
            "junho",
            "julho",
            "agosto",
            "setembro",
            "outubro",
            "novembro",
            "dezembro"
        ];

        return `${dia} de ${meses[mes - 1]} de ${ano}`;
    }

    return (
        <div className="fd-box">

            <h3 className="fd-titulo">Fechamento Diário</h3>

            <div className="fd-relogio">
                <strong>{hora}</strong>
            </div>

            <div className="fd-dia-atual">
                <p className="fd-dia-data">
                    Dia comercial: {formatarDataExtenso(dados.diaAtual.data)}
                </p>
                <p className="fd-dia-total">
                    Total vendido no dia: <strong>R$ {totalAtual.toFixed(2)}</strong>
                </p>

                {infoAtual.texto && (
                    <p className={`fd-diferenca ${infoAtual.classe}`}>
                        {infoAtual.texto}
                    </p>
                )}
            </div>

            <h4 className="fd-subtitulo">Últimos 20 dias</h4>

            <div className="fd-lista">
                {dados.ultimos20dias.map((d, i) => {

                    const anterior = i + 1 < dados.ultimos20dias.length
                        ? dados.ultimos20dias[i + 1].total
                        : null;

                    const info = calcularDiferenca(d.total, anterior);

                    return (
                        <div key={i} className="fd-item">
                            <span className="fd-item-data">{formatarDataExtenso(d.data)}</span>

                            <div className="fd-item-valores">
                                <strong className="fd-item-total">
                                    R$ {d.total.toFixed(2)}
                                </strong>

                                {info.texto && (
                                    <small className={`fd-item-diferenca ${info.classe}`}>
                                        {info.texto}
                                    </small>
                                )}
                            </div>
                        </div>
                    );

                })}
            </div>

        </div>
    );
}
