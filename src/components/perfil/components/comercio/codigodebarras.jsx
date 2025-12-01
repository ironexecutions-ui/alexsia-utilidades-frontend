import { useState, useRef, useEffect } from "react";
import { API_URL } from "../../../../config";
import { useVenda } from "./vendaprovider";
import "./codigodebarras.css";

export default function CodigoDeBarras() {

    const [codigo, setCodigo] = useState("");
    const [sugestoes, setSugestoes] = useState([]);
    const { setProdutoAtual, adicionarItem } = useVenda();
    const inputRef = useRef(null);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [formNovo, setFormNovo] = useState({
        codigo_barras: "",
        nome: "",
        categoria: "",
        preco_venda: "",
        unidade_medida: "",
        descricao: ""
    });

    // ----------------------------------------------------------
    // BUSCAR PRODUTO NORMAL
    // ----------------------------------------------------------
    async function buscarProduto(cod) {
        try {
            const token = localStorage.getItem("token");

            // ----------------------------------------------------------
            // NOVA REGRA:
            // Se o código tiver letras ou misturar letras e números
            // então abre o modal direto preenchendo nome e um código aleatório
            // ----------------------------------------------------------
            const apenasNumeros = /^[0-9]+$/.test(cod);

            if (!apenasNumeros) {

                const numeroAleatorio = Math.floor(Math.random() * 999999999999).toString().padStart(12, "0");

                setFormNovo({
                    codigo_barras: numeroAleatorio,
                    nome: cod,
                    categoria: "Outros",
                    preco_custo: 0,
                    preco_venda: 0,
                    unidade_medida: "",
                    descricao: "",
                    imagem: null
                });

                setSugestoes([]);
                setMostrarModal(true);
                return;
            }

            // ----------------------------------------------------------
            // BUSCA NORMAL (código numérico)
            // ----------------------------------------------------------

            const resp = await fetch(`${API_URL}/painel/produto?codigo=${cod}`, {
                headers: { Authorization: token }
            });

            const data = await resp.json();

            if (data.status === "erro") {

                setFormNovo({
                    codigo_barras: cod,
                    nome: "",
                    categoria: "Outros",
                    preco_custo: 0,
                    preco_venda: 0,
                    unidade_medida: "",
                    descricao: "",
                    imagem: null
                });

                setSugestoes([]);
                setMostrarModal(true);
                return;
            }

            setProdutoAtual(data.produto);
            adicionarItem(data.produto);

        } catch (err) {
            console.log("Erro ao buscar produto", err);
        }
    }


    // ----------------------------------------------------------
    // BUSCA POR NOME
    // ----------------------------------------------------------
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
    async function salvarNovoProduto() {
        try {
            const formData = new FormData();

            for (let key in formNovo) {

                if (key === "preco_venda" || key === "preco_custo") {
                    formData.append(key, Number(formNovo[key]));
                }
                else if (key === "imagem") {
                    if (formNovo.imagem) {
                        formData.append("imagem", formNovo.imagem);
                    }
                }
                else {
                    formData.append(key, String(formNovo[key]));
                }
            }

            const resp = await fetch(`${API_URL}/produtos`, {
                method: "POST",
                body: formData
            });

            const data = await resp.json();

            if (!resp.ok) {
                alert(data.erro || "Erro ao salvar");
                return;
            }

            setMostrarModal(false);
            await buscarProduto(formNovo.codigo_barras);
            setCodigo("");
            if (inputRef.current) inputRef.current.focus();

        } catch (err) {
            console.log("Erro ao salvar produto novo", err);
        }
    }

    // ----------------------------------------------------------
    // EVENTOS DO INPUT
    // ----------------------------------------------------------
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

    // ----------------------------------------------------------
    // UI
    // ----------------------------------------------------------
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

            {/* MODAL DO NOVO PRODUTO */}
            {mostrarModal && (
                <div className="modal-fundo">
                    <div className="modal-caixa" onClick={(e) => e.stopPropagation()}>

                        <h2>Produto não cadastrado, por favor cadastre aqui rapido</h2>

                        <label>Código de barras</label>
                        <input type="text" value={formNovo.codigo_barras} disabled />

                        <label>Nome do produto</label>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={formNovo.nome}
                            onChange={e => setFormNovo({ ...formNovo, nome: e.target.value })}
                        />

                        <label>Categoria</label>
                        <input
                            list="categorias-modal"
                            type="text"
                            placeholder="Categoria"
                            value={formNovo.categoria}
                            onChange={e => setFormNovo({ ...formNovo, categoria: e.target.value })}
                        />

                        <datalist id="categorias-modal">
                            <option value="Alimentos" />
                            <option value="Bebidas" />
                            <option value="Açougue" />
                            <option value="Frios e Laticínios" />
                            <option value="Hortifruti" />
                            <option value="Padaria" />
                            <option value="Limpeza" />
                            <option value="Higiene Pessoal" />
                            <option value="Utilidades" />
                            <option value="Doces" />
                            <option value="Outros" />
                        </datalist>
                        <label style={{ display: "none" }}>Preço de custo</label>
                        <input
                            type="number"
                            style={{ display: "none" }}
                            value={formNovo.preco_custo}
                            onChange={e => setFormNovo({ ...formNovo, preco_custo: Number(e.target.value) })}
                        />
                        <textarea
                            style={{ display: "none" }}
                            value={formNovo.descricao}
                            onChange={e => setFormNovo({ ...formNovo, descricao: e.target.value })}
                        />
                        <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={e => setFormNovo({ ...formNovo, imagem: e.target.files[0] })}
                        />

                        <label>Preço de venda</label>
                        <input
                            type="number"
                            placeholder="Preço de venda"
                            value={formNovo.preco_venda}
                            onChange={e => setFormNovo({ ...formNovo, preco_venda: e.target.value })}
                        />

                        <label>Unidade</label>
                        <input
                            type="text"
                            placeholder="Unidade"
                            value={formNovo.unidade_medida}
                            onChange={e => setFormNovo({ ...formNovo, unidade_medida: e.target.value })}
                        />


                        <div className="modal-botoes">
                            <button onClick={() => setMostrarModal(false)}>Cancelar</button>
                            <button onClick={salvarNovoProduto}>Salvar</button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
