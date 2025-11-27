import React from "react";
import "./rodape.css";

export default function Rodape() {
    return (
        <footer className="rodape">
            <p className="rodape-texto">
                Alexsia Utilidades, qualidade e variedade para o seu dia.
            </p>

            <span className="rodape-direitos">
                © 2025. Todos os direitos reservados.
            </span>

            <div className="rodape-linha"></div>

            <a
                href="https://ironexecutions.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="rodape-creditos"
            >
                Desenvolvido por <strong>Iron Executions</strong>
            </a>
        </footer>
    );
}
