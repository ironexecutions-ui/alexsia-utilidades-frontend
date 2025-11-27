import { useVenda } from "./vendaprovider";
import './produtoatual.css';

export default function ProdutoAtual() {

    const { produtoAtual } = useVenda();

    if (!produtoAtual) {
        return (
            <div className="pa-box vazio">
                <h3>Produto atual</h3>
                <p className="pa-aviso">Nenhum produto escaneado</p>
            </div>
        );
    }

    return (
        <div className="pa-box">
            <h3 className="pa-titulo">Produto atual</h3>

            <div className="pa-content">

                <div className="pa-img-area">
                    <img
                        src={produtoAtual.imagem_url}
                        alt="Produto sem foto"
                        className="pa-img"
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
                        <span className="pa-preco">
                            R$ {produtoAtual.preco_venda.toFixed(2)}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
