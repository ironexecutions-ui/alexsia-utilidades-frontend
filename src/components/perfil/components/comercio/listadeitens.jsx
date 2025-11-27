import { useVenda } from "./vendaprovider";
import "./listadeitens.css";

export default function ListaDeItens() {

    const { itens, aumentarQuantidade, diminuirQuantidade, removerItem } = useVenda();

    return (
        <div className="lista-itens">
            <h3>Itens da venda</h3>

            {itens.length === 0 && (
                <p>Nenhum item ainda</p>
            )}

            {itens.length > 0 && (
                <table className="tabela-itens">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th style={{ textAlign: "right" }} >Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {[...itens].reverse().map(item => (
                            <tr key={item.id}>
                                <td>
                                    {item.nome} {item.unidade_medida && (
                                        <span className="unidade">({item.unidade_medida})</span>
                                    )}
                                </td>

                                <td className="col-quantidade">

                                    <button
                                        className="btn-menos"
                                        onClick={() => diminuirQuantidade(item.id)}
                                    >
                                        −
                                    </button>

                                    <span className="quantidade">{item.quantidade}</span>

                                    <button
                                        className="btn-mais"
                                        onClick={() => aumentarQuantidade(item.id)}
                                    >
                                        +
                                    </button>

                                    <button
                                        className="btn-remover"
                                        onClick={() => removerItem(item.id)}
                                    >
                                        x
                                    </button>
                                </td>

                                <td className="col-total">
                                    R$ {item.subtotal.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            )}
        </div>
    );
}
