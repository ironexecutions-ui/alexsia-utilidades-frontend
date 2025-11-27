import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import "./inventario.css";
import TabelaProdutos from "./tabelainventario";

export default function Inventario() {

    const [mostrarForm, setMostrarForm] = useState(false);
    const [produtos, setProdutos] = useState([]);
    const [erroCodigo, setErroCodigo] = useState("");
    const [previewImagem, setPreviewImagem] = useState(null);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [produtoIdEdicao, setProdutoIdEdicao] = useState(null);

    const [form, setForm] = useState({
        codigo_barras: "",
        nome: "",
        categoria: "",
        preco_custo: 0,
        preco_venda: 0,
        unidade_medida: "",
        descricao: ""
    });

    const [imagem, setImagem] = useState(null);

    function handleChange(e) {
        let valor = e.target.value;

        if (e.target.name === "nome") {
            valor = capitalize(valor);
        }

        setForm({ ...form, [e.target.name]: valor });

        if (e.target.name === "codigo_barras") {
            setErroCodigo("");
        }
    }


    async function carregarProdutos() {
        try {
            const resp = await fetch(`${API_URL}/produtos`);
            const data = await resp.json();
            setProdutos(data);
        } catch (e) {
            console.log("Erro ao carregar produtos", e);
        }
    }
    function editarProduto(produto) {
        setModoEdicao(true);
        setProdutoIdEdicao(produto.id);
        setMostrarForm(true);

        setForm({
            codigo_barras: produto.codigo_barras,
            nome: capitalize(produto.nome),
            categoria: produto.categoria || "",
            preco_custo: produto.preco_custo,
            preco_venda: produto.preco_venda,
            unidade_medida: produto.unidade_medida || "",
            descricao: produto.descricao || ""
        });

        setPreviewImagem(produto.imagem_url || null);
        setImagem(null);

        setTimeout(() => {
            document.querySelector(".inv-form")?.scrollIntoView({ behavior: "smooth" });
        }, 200);
    }



    async function handleSubmit(e) {
        e.preventDefault();
        form.nome = capitalize(form.nome);

        // Se for edição atualizar produto
        if (modoEdicao) {
            const formData = new FormData();

            for (let key in form) {
                formData.append(key, String(form[key]));
            }

            if (imagem) {
                formData.append("imagem", imagem);
            }

            try {
                const resp = await fetch(`${API_URL}/produtos/${produtoIdEdicao}`, {
                    method: "PUT",
                    body: formData
                });

                const data = await resp.json();

                if (resp.ok) {
                    setModoEdicao(false);
                    setProdutoIdEdicao(null);
                    setMostrarForm(false);
                    carregarProdutos();
                } else {
                    alert(data.erro || "Erro ao atualizar");
                }

            } catch (e) {
                console.log("Erro ao editar", e);
            }

            return;
        }

        // Caso não esteja em edição é criação normal
        const existente = produtos.find(p => p.codigo_barras == form.codigo_barras);

        if (existente) {
            setErroCodigo(`Este código de barras já está registrado. Produto correspondente: ${existente.nome}`);
            return;
        }

        const formData = new FormData();
        for (let key in form) formData.append(key, String(form[key]));
        if (imagem) formData.append("imagem", imagem);

        try {
            const resp = await fetch(`${API_URL}/produtos`, {
                method: "POST",
                body: formData
            });

            const data = await resp.json();

            if (resp.ok) {
                setErroCodigo("");

                setForm({
                    codigo_barras: "",
                    nome: "",
                    categoria: "",
                    preco_custo: 0,
                    preco_venda: 0,
                    unidade_medida: "",
                    descricao: ""
                });

                setImagem(null);
                setMostrarForm(false);
                carregarProdutos();
            } else {
                alert(data.erro || "Erro ao salvar produto");
            }

        } catch (e) {
            console.log("Erro", e);
        }
    }

    useEffect(() => {
        carregarProdutos();
    }, []);
    function capitalize(texto) {
        if (!texto) return "";
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    return (
        <div className="inv-container">
            <h2>Inventário</h2>

            <button className="inv-btn" onClick={() => setMostrarForm(!mostrarForm)}>
                {modoEdicao ? "Editar produto" : "Registrar produto"}
            </button>

            {mostrarForm && (
                <form
                    key={produtoIdEdicao || "novo"}
                    className="inv-form"
                    onSubmit={handleSubmit}
                >


                    <input type="text" name="codigo_barras" value={form.codigo_barras} placeholder="Código de barras" onChange={handleChange} required />
                    <input type="text" name="nome" value={form.nome} placeholder="Nome" onChange={handleChange} required />
                    <input list="categorias" name="categoria" value={form.categoria} placeholder="Categoria" onChange={handleChange} required />
                    <datalist id="categorias">
                        <option value="Alimentos" />
                        <option value="Bebidas" />
                        <option value="Açougue" />
                        <option value="Frios e Laticínios" />
                        <option value="Hortifruti" />
                        <option value="Padaria" />
                        <option value="Limpeza" />
                        <option value="Higiene Pessoal" />
                        <option value="Utilidades" />
                        <option value="Outros" />
                    </datalist>


                    <input style={{ display: "none" }}
                        type="number"
                        name="preco_custo"
                        value={form.preco_custo}
                        placeholder="Preço de custo"
                        onChange={(e) => setForm({ ...form, preco_custo: Number(e.target.value) })}
                        required
                    />

                    <input
                        type="number"
                        name="preco_venda"
                        placeholder="Preço de venda"
                        step="0.01"
                        value={form.preco_venda}
                        onChange={(e) => {
                            const valor = e.target.value;
                            setForm({ ...form, preco_venda: valor });
                        }}
                        required
                    />


                    <input type="text" name="unidade_medida" value={form.unidade_medida} placeholder="Unidade" onChange={handleChange} required />

                    <textarea name="descricao" value={form.descricao} placeholder="Descrição" rows="3" style={{ display: "none" }} onChange={handleChange} />

                    <label>Imagem do produto</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const arquivo = e.target.files[0];
                            setImagem(arquivo);

                            if (arquivo) {
                                setPreviewImagem(URL.createObjectURL(arquivo));
                            }
                        }}
                    />
                    {previewImagem && (
                        <img
                            src={previewImagem}
                            alt="Pré visualização"
                            className="inv-preview"
                        />
                    )}

                    {erroCodigo && <p className="inv-erro">{erroCodigo}</p>}

                    <button className="inv-submit" type="submit">
                        {modoEdicao ? "Salvar alterações" : "Salvar"}
                    </button>
                </form>
            )}

            <TabelaProdutos produtos={produtos} recarregar={carregarProdutos} editarProduto={editarProduto} />

        </div>
    );
}
