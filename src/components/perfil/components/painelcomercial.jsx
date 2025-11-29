import React, { useEffect } from "react";
import "./painelcomercial.css";

import { useVenda } from "./comercio/vendaprovider";
import { API_URL } from "../../../config";

import CodigoDeBarras from "./comercio/codigodebarras";
import ProdutoAtual from "./comercio/produtoatual";
import ListaDeItens from "./comercio/listadeitens";
import ValorTotal from "./comercio/valortotal";
import ModalPagamento from "./comercio/modalpagamento";
import ModalAviso from "./comercio/modalaviso";


export default function PainelComercial() {

    const { itens, total, limparVenda } = useVenda();

    useEffect(() => {
        function registrar() {
            window.dispatchEvent(new CustomEvent("modal-aviso", {
                detail: "Registrando venda"
            }));

            enviarVenda();
        }

        window.addEventListener("pagamento-recebido", registrar);
        return () => window.removeEventListener("pagamento-recebido", registrar);
    }, [itens, total]);

    async function enviarVenda() {

        const token = localStorage.getItem("token");

        const resp = await fetch(`${API_URL}/painel/registrar-venda`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                itens,
                total
            })
        });

        const data = await resp.json();

        if (data.status === "ok") {

            const agora = new Date();

            // converte para horário do Brasil
            const brasil = new Date(agora.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

            const ano = brasil.getFullYear();
            const mes = String(brasil.getMonth() + 1).padStart(2, "0");
            const dia = String(brasil.getDate()).padStart(2, "0");

            const hora = String(brasil.getHours()).padStart(2, "0");
            const min = String(brasil.getMinutes()).padStart(2, "0");
            const seg = String(brasil.getSeconds()).padStart(2, "0");

            const nomeArquivo = `${ano}-${mes}-${dia} ${hora}-${min}-${seg}.pdf`;

            const link = document.createElement("a");
            link.href = "data:application/pdf;base64," + data.pdf_base64;
            link.download = nomeArquivo;
            link.click();

            window.dispatchEvent(new Event("modal-fechar-aviso"));
            limparVenda();
        }

    } return (
        <div className="painel-container">

            <div className="painel-esquerda">
                <CodigoDeBarras />
                <ProdutoAtual />
            </div>

            <div className="painel-direita">
                <ListaDeItens />
                <br />
                <ValorTotal />

            </div>

            <ModalPagamento />
            <ModalAviso />
        </div>
    );
}
