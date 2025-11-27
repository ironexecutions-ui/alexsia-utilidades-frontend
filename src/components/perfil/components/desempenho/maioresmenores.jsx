import React, { useState } from "react";
import { API_URL } from "../../../../config";
import "./maioresmenores.css";

export default function MaioresMenores() {

    const [data, setData] = useState("");
    const [limite, setLimite] = useState(5);
    const [maiores, setMaiores] = useState([]);
    const [menores, setMenores] = useState([]);

    async function buscar() {
        if (!data) return alert("Escolha uma data");

        try {
            const resp = await fetch(
                `${API_URL}/desempenho/maiores-menores?data=${data}&limite=${limite}`
            );

            const dados = await resp.json();

            setMaiores(dados.maiores || []);
            setMenores(dados.menores || []);
        } catch (err) {
            console.log("Erro ao buscar dados", err);
        }
    }

    return (
        <div className="pagina-desempenho">

            <div className="filtros">
                <div>
                    <label>Data</label>
                    <input
                        type="date"
                        value={data}
                        onChange={e => setData(e.target.value)}
                    />
                </div>

                <div>
                    <label>Quantidade desejada</label>
                    <input
                        type="number"
                        min="1"
                        value={limite}
                        onChange={e => setLimite(e.target.value)}
                    />
                </div>

                <button className="btn-buscar" onClick={buscar}>Buscar</button>
            </div>

            <h3>Mais vendidos</h3>
            <table className="tabela">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Total vendido</th>
                    </tr>
                </thead>
                <tbody>
                    {maiores.map((p, i) => (
                        <tr key={i}>
                            <td>{p.nome_produto}</td>
                            <td>{p.total_vendido}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Menos vendidos</h3>
            <table className="tabela tabela-menos">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Total vendido</th>
                    </tr>
                </thead>
                <tbody>
                    {menores.map((p, i) => (
                        <tr key={i}>
                            <td>{p.nome_produto}</td>
                            <td>{p.total_vendido}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
