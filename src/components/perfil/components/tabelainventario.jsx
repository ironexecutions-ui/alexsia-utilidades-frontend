import React, { useState } from "react";
import "./tabelainventario.css";
import { API_URL } from "../../../config";

export default function TabelaProdutos({ produtos, recarregar, editarProduto }) {

    const [buscaNome, setBuscaNome] = useState("");
    const [buscaCodigo, setBuscaCodigo] = useState("");

    const [modalAberto, setModalAberto] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [valor, setValor] = useState("");
    const [operacao, setOperacao] = useState("add");
    const [pagina, setPagina] = useState(1);
    const itensPorPagina = 15;
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    const filtrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(buscaNome.toLowerCase()) &&
        p.codigo_barras.toString().includes(buscaCodigo)
    );

    const exibidos = filtrados.slice(inicio, fim);

    function abrirModal(produto, op) {
        setProdutoSelecionado(produto);
        setOperacao(op);
        setValor("");
        setModalAberto(true);
    }

    async function enviar() {
        const form = new FormData();
        form.append("produto_id", produtoSelecionado.id);
        form.append("quantos", valor);

        const url = operacao === "add"
            ? "/soma_produtos/add"
            : "/soma_produtos/remove";

        await fetch(`${API_URL}${url}`, {
            method: "POST",
            body: form
        });

        setModalAberto(false);
        recarregar();
    }

    return (
        <div className="inv-tabela-container">

            <div className="inv-filtros">
                <input
                    type="text"
                    placeholder="Buscar pelo nome"
                    className="inv-busca"
                    value={buscaNome}
                    onChange={(e) => {
                        setPagina(1);
                        setBuscaNome(e.target.value);
                    }}
                />

                <input
                    type="text"
                    placeholder="Buscar pelo código de barras"
                    className="inv-busca"
                    value={buscaCodigo}
                    onChange={(e) => {
                        setPagina(1);
                        setBuscaCodigo(e.target.value);
                    }}
                />
            </div>

            <table className="inv-tabela">
                <thead>
                    <tr>
                        <th>Imagem</th>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Preço venda</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody className="tabela">
                    {exibidos.map((p) => (
                        <tr key={p.id}>

                            {/* Coluna imagem com suporte a arrastar */}
                            <td>
                                {p.imagem_url ? (
                                    <img src={p.imagem_url} alt={p.nome} className="inv-img" />
                                ) : (
                                    <div
                                        className="inv-drop-tabela"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={async (e) => {
                                            e.preventDefault();
                                            const arquivo = e.dataTransfer.files[0];
                                            if (!arquivo) return;

                                            const form = new FormData();
                                            form.append("imagem", arquivo);
                                            form.append("nome", p.nome);
                                            form.append("categoria", p.categoria);
                                            form.append("preco_custo", p.preco_custo);
                                            form.append("preco_venda", p.preco_venda);
                                            form.append("unidade_medida", p.unidade_medida);
                                            form.append("descricao", p.descricao);
                                            form.append("codigo_barras", p.codigo_barras);

                                            await fetch(`${API_URL}/produtos/${p.id}`, {
                                                method: "PUT",
                                                body: form
                                            });

                                            recarregar();
                                        }}
                                    >
                                        Arraste a imagem
                                    </div>
                                )}
                            </td>

                            {/* Coluna código com botão copiar */}
                            <td>
                                <button
                                    className="inv-copy-btn"
                                    onClick={() => navigator.clipboard.writeText(p.codigo_barras)}
                                >
                                    Copiar
                                </button>
                            </td>

                            <td>{p.nome}</td>
                            <td>{p.preco_venda} R$</td>

                            <td>
                                <button className="inv-btn-menos" onClick={() => abrirModal(p, "remove")}>-</button>
                                <span className="inv-total">{p.total_somas}</span>
                                <button className="inv-btn-mais" onClick={() => abrirModal(p, "add")}>+</button>

                                <button className="inv-editar" onClick={() => editarProduto(p)}>
                                    Editar
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="inv-paginacao">
                {pagina > 1 && (
                    <button onClick={() => setPagina(pagina - 1)} className="inv-pagina-btn">
                        Página anterior
                    </button>
                )}

                {fim < filtrados.length && (
                    <button onClick={() => setPagina(pagina + 1)} className="inv-pagina-btn">
                        Próxima página
                    </button>
                )}
            </div>

            {modalAberto && (
                <div className="inv-modal-back">
                    <div className="inv-modal">
                        <h3>{produtoSelecionado.nome}</h3>

                        <img
                            src={produtoSelecionado.imagem_url}
                            className="inv-modal-img"
                            alt={produtoSelecionado.nome}
                        />

                        <p className="inv-modal-info">
                            Unidade: <strong>{produtoSelecionado.unidade_medida}</strong>
                        </p>

                        <p className="inv-modal-info">
                            Preço de venda: <strong>R$ {produtoSelecionado.preco_venda}</strong>
                        </p>

                        <input
                            type="number"
                            placeholder="Quantidade"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                        />

                        <button className="inv-modal-confirmar" onClick={enviar}>
                            Confirmar
                        </button>

                        <button className="inv-modal-fechar" onClick={() => setModalAberto(false)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

}
