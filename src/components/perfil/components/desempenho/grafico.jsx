import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../config";
import "./grafico.css";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

export default function Grafico() {

    const [dias, setDias] = useState([]);
    const [semanas, setSemanas] = useState([]);
    const [meses, setMeses] = useState([]);

    async function carregar() {
        try {
            const resp = await fetch(`${API_URL}/desempenho/graficos`);
            const dados = await resp.json();

            setDias(dados.dias || []);
            setSemanas(dados.semanas || []);
            setMeses(dados.meses || []);

        } catch (err) {
            console.log("Erro ao buscar gráficos", err);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    function montarGrafico(info) {
        if (!info || info.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        return {
            labels: info.map(i => i.label),
            datasets: [
                {
                    label: "R$ total vendido",
                    data: info.map(i => i.total),
                    borderColor: "#d4af37",
                    backgroundColor: "rgba(212, 175, 55, 0.20)",
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: "#d4af37",
                    pointBorderColor: "#b8932a",
                    tension: 0.35,
                    fill: true
                }
            ]
        };
    }

    const opcoes = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#7c0a00",
                    font: { weight: 700 }
                }
            },
            tooltip: {
                backgroundColor: "#fff4d3",
                borderColor: "#d4af37",
                borderWidth: 2,
                titleColor: "#7c0a00",
                bodyColor: "#7c0a00",
                padding: 12
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "#7c0a00",
                    font: { weight: 600 }
                },
                grid: {
                    color: "rgba(212, 175, 55, 0.25)"
                }
            },
            y: {
                ticks: {
                    color: "#7c0a00",
                    font: { weight: 600 }
                },
                grid: {
                    color: "rgba(212, 175, 55, 0.15)"
                }
            }
        }
    };

    return (
        <div className="pagina-desempenho">

            <h3>Últimos 7 dias</h3>
            <div className="grafico-box">
                <Line data={montarGrafico(dias)} options={opcoes} />
            </div>

            <h3>Últimas 7 semanas</h3>
            <div className="grafico-box">
                <Line data={montarGrafico(semanas)} options={opcoes} />
            </div>

            <h3>Últimos 7 meses</h3>
            <div className="grafico-box">
                <Line data={montarGrafico(meses)} options={opcoes} />
            </div>

        </div>
    );
}
