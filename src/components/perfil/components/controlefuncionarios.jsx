import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "../../../config";
import "./controlefuncionarios.css";

export default function ControleFuncionarios() {

    const [funcionarios, setFuncionarios] = useState([]);
    const [modalAdicionar, setModalAdicionar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalCodigo, setModalCodigo] = useState(false);

    const [confApagar, setConfApagar] = useState(null); // id que aguarda 2º clique
    const [selecionado, setSelecionado] = useState(null);

    const [novo, setNovo] = useState({
        nome_completo: "",
        email: "",
        senha: "",
        funcao: ""
    });

    const [editar, setEditar] = useState({
        id: "",
        nome_completo: "",
        email: "",
        senha: "",
        funcao: ""
    });

    const barcodeRef = useRef(null);

    async function carregar() {
        const resp = await fetch(`${API_URL}/funcionarios`);
        const data = await resp.json();
        setFuncionarios(data);
    }

    useEffect(() => {
        carregar();
    }, []);

    function abrirModalAdicionar() {
        setNovo({
            nome_completo: "",
            email: "",
            senha: "",
            funcao: ""
        });
        setModalAdicionar(true);
    }

    async function salvarNovo() {
        const resp = await fetch(`${API_URL}/funcionarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novo)
        });

        const data = await resp.json();

        if (resp.status !== 200) {
            alert(data.detail || "Erro ao adicionar");
            return;
        }

        setModalAdicionar(false);
        carregar();
    }

    function abrirModalEditar(f) {
        setEditar({
            id: f.id,
            nome_completo: f.nome_completo,
            email: f.email,
            senha: "",
            funcao: f.funcao
        });
        setModalEditar(true);
    }

    async function salvarEdicao() {
        const resp = await fetch(`${API_URL}/funcionarios/${editar.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editar)
        });

        const data = await resp.json();

        if (resp.status !== 200) {
            alert(data.detail || "Erro ao editar");
            return;
        }

        setModalEditar(false);
        carregar();
    }

    async function apagar(id) {

        if (confApagar !== id) {
            setConfApagar(id);
            return;
        }

        const resp = await fetch(`${API_URL}/funcionarios/${id}`, { method: "DELETE" });
        setConfApagar(null);
        carregar();
    }

    function abrirModalCodigo(funcionario) {
        setSelecionado(funcionario);
        setModalCodigo(true);

        setTimeout(() => {
            if (barcodeRef.current) {
                window.JsBarcode(barcodeRef.current, funcionario.codigo, {
                    format: "CODE128",
                    width: 2,
                    height: 70,
                    displayValue: false
                });

            }
        }, 150);
    }

    function imprimirCodigo() {
        window.print();
    }

    return (
        <div className="controle-container">
            <h2>Controle de Funcionários</h2>

            <button className="btn-add" onClick={abrirModalAdicionar}>Adicionar Funcionário</button>

            <table className="tabela-func">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Nome</th>
                        <th>Senha</th>
                        <th>Função</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody className="tableusuarios">
                    {funcionarios.map(f => (
                        <tr key={f.id}>
                            <td>{f.email}</td>
                            <td>{f.nome_completo}</td>
                            <td>******</td>
                            <td>{f.funcao}</td>
                            <td>

                                <button className="btn-editar" onClick={() => abrirModalEditar(f)}>Editar</button>

                                <button
                                    className="btn-apagar"
                                    onClick={() => apagar(f.id)}
                                >
                                    {confApagar === f.id ? "Confirmar" : "Apagar"}
                                </button>

                                <button
                                    className="btn-codigo"
                                    onClick={() => abrirModalCodigo(f)}
                                >
                                    Código
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Adicionar */}
            {modalAdicionar && (
                <div className="modal-bg">
                    <div className="modal">
                        <h3>Novo Funcionário</h3>

                        <input
                            placeholder="Nome completo"
                            value={novo.nome_completo}
                            onChange={e => setNovo({ ...novo, nome_completo: e.target.value })}
                        />

                        <input
                            placeholder="Email"
                            value={novo.email}
                            onChange={e => setNovo({ ...novo, email: e.target.value })}
                        />

                        <input
                            placeholder="Senha"
                            type="password"
                            value={novo.senha}
                            onChange={e => setNovo({ ...novo, senha: e.target.value })}
                        />

                        <input list="funcao"
                            placeholder="Função"
                            value={novo.funcao}
                            onChange={e => setNovo({ ...novo, funcao: e.target.value })}
                        />
                        <datalist id="funcao" >
                            <option value="admin">Administrador</option>
                            <option value="func">Funcionario</option>
                        </datalist>
                        <div className="modal-btns">
                            <button onClick={salvarNovo}>Guardar</button>
                            <button onClick={() => setModalAdicionar(false)}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Editar */}
            {modalEditar && (
                <div className="modal-bg">
                    <div className="modal">
                        <h3>Editar Funcionário</h3>

                        <input
                            value={editar.nome_completo}
                            onChange={e => setEditar({ ...editar, nome_completo: e.target.value })}
                        />

                        <input
                            value={editar.email}
                            onChange={e => setEditar({ ...editar, email: e.target.value })}
                        />

                        <input
                            placeholder="Nova senha (opcional)"
                            type="password"
                            value={editar.senha}
                            onChange={e => setEditar({ ...editar, senha: e.target.value })}
                        />

                        <input list="func"
                            value={editar.funcao}
                            onChange={e => setEditar({ ...editar, funcao: e.target.value })}
                        />
                        <datalist id="func" >
                            <option value="admin">Administrador</option>
                            <option value="func">Funcionario</option>
                        </datalist>
                        <div className="modal-btns">
                            <button onClick={salvarEdicao}>Salvar</button>
                            <button onClick={() => setModalEditar(false)}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Código */}
            {modalCodigo && selecionado && (
                <div className="modal-bg">
                    <div className="modal codigo-modal">
                        <h3>{selecionado.nome_completo}</h3>

                        <svg ref={barcodeRef}></svg>
                        <br />
                        <div className="modal-btns">
                            <button style={{ display: 'none' }} onClick={imprimirCodigo}>Imprimir</button>
                            <button onClick={() => setModalCodigo(false)}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
