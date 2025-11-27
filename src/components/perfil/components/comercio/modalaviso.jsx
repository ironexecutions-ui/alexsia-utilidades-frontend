import { useEffect, useState } from "react";
import "./modalaviso.css";

export default function ModalAviso() {

    const [mensagem, setMensagem] = useState(null);

    useEffect(() => {
        function abrir(e) {
            const msg = e.detail;
            setMensagem(msg);

            if (msg !== "Registrando venda") {
                setTimeout(() => {
                    setMensagem(null);
                }, 1800);
            }
        }

        function fechar() {
            setMensagem(null);
        }

        window.addEventListener("modal-aviso", abrir);
        window.addEventListener("modal-fechar-aviso", fechar);

        return () => {
            window.removeEventListener("modal-aviso", abrir);
            window.removeEventListener("modal-fechar-aviso", fechar);
        };
    }, []);

    if (!mensagem) return null;

    return (
        <div className="aviso-fundo">
            <div className="aviso-caixa">
                <p>{mensagem}</p>
            </div>
        </div>
    );
}
