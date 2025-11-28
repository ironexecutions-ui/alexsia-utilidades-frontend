import { useVenda } from "./vendaprovider";
import './valortotal.css'
export default function ValorTotal() {

    const { total } = useVenda();

    return (
        <div className="total-container">
            <h2>Total</h2>

            <div className="total-valor">
                R$ {total.toFixed(2)}
            </div>

            <div className="botoes-total">
                <button
                    className="btn-cobrar"
                    onClick={() => window.dispatchEvent(new Event("abrir-pagamento"))}
                >
                    Cobrar
                </button>

                <button
                    className="btn-cancelar"
                    onClick={() => window.location.reload()}
                >
                    Cancelar
                </button>
            </div>


        </div>
    );
}
