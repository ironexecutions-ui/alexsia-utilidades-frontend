import { useState, useEffect } from "react";
import { useVenda } from "./vendaprovider";
import "./modalpagamento.css";

export default function ModalPagamento() {

    const [mostrar, setMostrar] = useState(false);
    const [modo, setModo] = useState("selecionar");
    const { total } = useVenda();

    useEffect(() => {
        function abrirPagamento() {
            setMostrar(true);
            setModo("selecionar");
        }
        window.addEventListener("abrir-pagamento", abrirPagamento);

        return () => {
            window.removeEventListener("abrir-pagamento", abrirPagamento);
        };
    }, []);

    if (!mostrar) return null;

    function fechar() {
        setMostrar(false);
        setModo("selecionar");
    }

    function recebido() {
        window.dispatchEvent(new CustomEvent("pagamento-recebido"));
        setMostrar(false);
    }

    return (
        <div className="fundo-modal">

            <div className="modal-caixa">

                {modo === "selecionar" && (
                    <>
                        <h2>Pagamento</h2>
                        <p>Total: R$ {total.toFixed(2)}</p>

                        <div className="botoes-pagamento">
                            <button onClick={() => setModo("pix")}>Pix</button>
                            <button onClick={() => setModo("cartao")}>Cartão</button>
                            <button onClick={() => setModo("dinheiro")}>Dinheiro</button>
                        </div>

                        <button className="btn-fechar" onClick={fechar}>Cancelar</button>
                    </>
                )}

                {modo === "pix" && (
                    <>
                        <h2>Pix</h2>
                        <p>Aguarde o cliente pagar</p>

                        <button className="btn-confirmar" onClick={recebido}>Recebido</button>
                        <button className="btn-voltar" onClick={() => setModo("selecionar")}>Voltar</button>
                    </>
                )}

                {modo === "cartao" && (
                    <>
                        <h2>Cartão</h2>
                        <p>Confirme o pagamento na maquininha</p>

                        <button className="btn-confirmar" onClick={recebido}>Recebido</button>
                        <button className="btn-voltar" onClick={() => setModo("selecionar")}>Voltar</button>
                    </>
                )}

                {modo === "dinheiro" && (
                    <PagamentoDinheiro
                        total={total}
                        voltar={() => setModo("selecionar")}
                        recebido={recebido}
                    />
                )}

            </div>
        </div>
    );
}

function PagamentoDinheiro({ total, voltar, recebido }) {

    const [valor, setValor] = useState("");
    const numero = parseFloat(valor) || 0;
    const troco = numero - total;

    return (
        <>
            <h2>Dinheiro</h2>

            <input
                autoFocus
                type="number"
                placeholder="Valor recebido"
                value={valor}
                onChange={e => setValor(e.target.value)}
            />

            {numero > 0 && (
                <p>Troco: R$ {troco > 0 ? troco.toFixed(2) : "0.00"}</p>
            )}

            <button
                className="btn-confirmar"
                onClick={recebido}
                disabled={numero < total}
            >
                Recebido
            </button>

            <button className="btn-voltar" onClick={voltar}>Voltar</button>
        </>
    );
}
