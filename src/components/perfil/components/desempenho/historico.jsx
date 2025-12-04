import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../config";
import "./historico.css";

export default function Historico() {

    const [historico, setHistorico] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [carregando, setCarregando] = useState(false);
    const itensPorPagina = 7;

    const [filtroUsuario, setFiltroUsuario] = useState("");
    const [filtroData, setFiltroData] = useState("");

    useEffect(() => {
        carregarMais();
    }, []);

    async function carregarMais() {
        try {
            setCarregando(true);

            const resp = await fetch(
                `${API_URL}/desempenho/historico?pagina=${pagina}&limite=${itensPorPagina}`
            );

            const dados = await resp.json();
            const lista = dados.historico || [];

            setHistorico(prev => [...prev, ...lista]);
            setPagina(prev => prev + 1);

        } catch (err) {
            console.log("Erro ao buscar histórico", err);
        } finally {
            setCarregando(false);
        }
    }

    let listaVendas = [...historico];

    listaVendas.sort((a, b) => b.venda_numero - a.venda_numero);

    if (filtroUsuario.trim() !== "") {
        listaVendas = listaVendas.filter(v =>
            v.usuario_nome.toLowerCase().includes(filtroUsuario.toLowerCase())
        );
    }

    if (filtroData.trim() !== "") {
        listaVendas = listaVendas.filter(v =>
            v.data_hora.startsWith(filtroData)
        );
    }

    return (
        <div className="hist-container">

            <h3 className="hist-titulo">Histórico de vendas</h3>

            <div className="hist-filtros">
                <input
                    className="hist-input"
                    type="text"
                    placeholder="Buscar por usuário"
                    value={filtroUsuario}
                    onChange={e => setFiltroUsuario(e.target.value)}
                />

                <input
                    className="hist-input"
                    type="date"
                    value={filtroData}
                    onChange={e => setFiltroData(e.target.value)}
                />
            </div>

            {listaVendas.map((venda, index) => (
                <div key={index} className="hist-bloco-venda">

                    <h4 className="hist-venda-titulo">
                        Venda #{venda.venda_numero}
                    </h4>

                    <p className="hist-info">
                        Usuário: {venda.usuario_nome}
                    </p>

                    <p className="hist-info">
                        Data e hora: {venda.data_hora}
                    </p>

                    <table className="hist-tabela-itens">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Qtd</th>
                                <th>Valor</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(venda.itens || []).map((item, i) => (
                                <tr key={i}>
                                    <td>{item.nome_produto}</td>
                                    <td>{item.quantidade}</td>
                                    <td>R$ {parseFloat(item.preco_pago).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p className="hist-total">
                        Total pago: R$ {parseFloat(venda.total_venda).toFixed(2)}
                    </p>

                    <hr />
                </div>
            ))}

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                    className="hist-btn-buscar"
                    onClick={carregarMais}
                    disabled={carregando}
                >
                    {carregando ? "Carregando..." : "Carregar mais"}
                </button>
            </div>

        </div>
    );
}
