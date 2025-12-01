import { useState } from "react";
import { useVenda } from "./vendaprovider";
import { API_URL } from "../../../../config";
import './produtoatual.css';

export default function ProdutoAtual() {

    const { produtoAtual, setProdutoAtual, atualizarPrecoItem } = useVenda();

    const [editando, setEditando] = useState(false);
    const [novoPreco, setNovoPreco] = useState("");

    if (!produtoAtual) {
        return (
            <div className="pa-box vazio">
                <h3>Produto atual</h3>
                <p className="pa-aviso">Nenhum produto escaneado</p>
            </div>
        );
    }

    const imagemFinal =
        produtoAtual.imagem_url && produtoAtual.imagem_url.trim() !== ""
            ? produtoAtual.imagem_url
            : "/logo.jpg";

    async function salvarPreco() {
        try {
            const token = localStorage.getItem("token");

            const resp = await fetch(`${API_URL}/painel/atualizar-preco`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({
                    id: produtoAtual.id,
                    preco: Number(novoPreco)
                })
            });

            const data = await resp.json();

            if (data.status === "ok") {

                const atualizado = {
                    ...produtoAtual,
                    preco_venda: Number(novoPreco)
                };

                setProdutoAtual(atualizado);
                atualizarPrecoItem(atualizado);

                setEditando(false);
            } else {
                alert("Erro ao atualizar preço");
            }
        } catch (err) {
            console.log("Erro ao salvar preço", err);
        }
    }

    return (
        <div className="pa-box">
            <h3 className="pa-titulo">Produto atual</h3>

            <div className="pa-content">

                <div className="pa-img-area">
                    <img
                        src={imagemFinal}
                        alt="Foto do produto"
                        className="pa-img"
                        onError={(e) => {
                            e.target.src = "/logo.jpg";
                        }}
                    />
                </div>

                <div className="pa-info">
                    <p className="pa-nome">{produtoAtual.nome}</p>

                    <div className="pa-linha">
                        <span className="pa-label">Categoria</span>
                        <span className="pa-valor">{produtoAtual.categoria}</span>
                    </div>

                    <div className="pa-linha">
                        <span className="pa-label">Preço</span>

                        {!editando ? (
                            <span
                                className="pa-preco clicavel"
                                onClick={() => {
                                    setNovoPreco(produtoAtual.preco_venda.toFixed(2));
                                    setEditando(true);
                                }}
                            >
                                R$ {produtoAtual.preco_venda.toFixed(2)}
                            </span>
                        ) : (
                            <div className="editar-preco">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={novoPreco}
                                    onChange={(e) => setNovoPreco(e.target.value)}
                                    className="input-preco"
                                />

                                <button onClick={salvarPreco} className="btn-salvar-preco">
                                    Salvar
                                </button>

                                <button
                                    onClick={() => setEditando(false)}
                                    className="btn-cancelar-preco"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
