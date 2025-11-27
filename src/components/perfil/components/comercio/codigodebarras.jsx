import { useState, useRef, useEffect } from "react";
import { API_URL } from "../../../../config";
import { useVenda } from "./vendaprovider";
import "./codigodebarras.css";

export default function CodigoDeBarras() {

    const [codigo, setCodigo] = useState("");
    const [sugestoes, setSugestoes] = useState([]);
    const { setProdutoAtual, adicionarItem } = useVenda();
    const inputRef = useRef(null);

    async function buscarProduto(cod) {
        try {
            const token = localStorage.getItem("token");
            const resp = await fetch(`${API_URL}/painel/produto?codigo=${cod}`, {
                headers: { Authorization: token }
            });

            const data = await resp.json();

            if (data.status === "erro") {
                window.dispatchEvent(new CustomEvent("modal-aviso", {
                    detail: data.mensagem
                }));
                return;
            }

            setProdutoAtual(data.produto);
            adicionarItem(data.produto);

        } catch (err) {
            console.log("Erro ao buscar produto", err);
        }
    }

    async function buscarPorNome(texto) {
        try {
            const token = localStorage.getItem("token");
            const resp = await fetch(`${API_URL}/painel/buscar-nome?q=${texto}`, {
                headers: { Authorization: token }
            });

            const data = await resp.json();

            if (data.status === "ok") {
                setSugestoes(data.produtos);
            }

        } catch (error) {
            console.log("Erro ao buscar por nome", error);
        }
    }

    function handleKey(e) {
        if (e.key === "Enter") {
            const cod = codigo.trim();
            if (cod !== "") {
                buscarProduto(cod);
                setCodigo("");
                setSugestoes([]);
            }
        }
    }

    function handleChange(e) {
        const valor = e.target.value;
        setCodigo(valor);

        if (valor.length >= 2) {
            buscarPorNome(valor);
        } else {
            setSugestoes([]);
        }
    }

    function selecionarItem(produto) {
        setProdutoAtual(produto);
        adicionarItem(produto);
        setCodigo("");
        setSugestoes([]);
        inputRef.current.focus();
    }

    function focarInput() {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    return (
        <div className="box" onClick={focarInput}>

            <h3>Buscar produto</h3>

            <input
                ref={inputRef}
                type="text"
                value={codigo}
                placeholder="Código ou nome"
                onChange={handleChange}
                onKeyDown={handleKey}
                onFocus={() => window.dispatchEvent(new Event("descer-painel"))}
                onBlur={() => window.dispatchEvent(new Event("subir-painel"))}
            />

            {sugestoes.length > 0 && (
                <div className="sugestoes-box">
                    {sugestoes.map(prod => (
                        <div
                            key={prod.id}
                            className="sugestao-item"
                            onClick={() => selecionarItem(prod)}
                        >
                            <img src={prod.imagem_url} alt="" className="sugestao-img" />

                            <div className="sug-info">
                                <p className="sug-nome">{prod.nome}</p>
                                {prod.unidade_medida && (
                                    <p className="sug-unidade">{prod.unidade_medida}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
