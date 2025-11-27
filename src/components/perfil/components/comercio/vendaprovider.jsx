import { createContext, useContext, useState } from "react";

const VendaContext = createContext();

export function VendaProvider({ children }) {

    const [produtoAtual, setProdutoAtual] = useState(null);
    const [itens, setItens] = useState([]);
    const [total, setTotal] = useState(0);

    function calcularTotal(lista) {
        const soma = lista.reduce((acc, item) => acc + item.subtotal, 0);
        setTotal(soma);
    }

    // -------------------------------------------------
    // ADICIONAR ITEM
    // -------------------------------------------------
    function adicionarItem(produto) {
        setItens(prev => {
            const existente = prev.find(p => p.id === produto.id);

            if (existente) {
                const listaNova = prev.map(p =>
                    p.id === produto.id
                        ? {
                            ...p,
                            quantidade: p.quantidade + 1,
                            subtotal: (p.quantidade + 1) * p.preco
                        }
                        : p
                );
                calcularTotal(listaNova);
                return listaNova;
            }

            const novoItem = {
                id: produto.id,
                nome: produto.nome,
                quantidade: 1,
                preco: produto.preco_venda,
                subtotal: produto.preco_venda,
                unidade_medida: produto.unidade_medida
            };


            const listaNova = [...prev, novoItem];
            calcularTotal(listaNova);
            return listaNova;
        });
    }

    // -------------------------------------------------
    // AUMENTAR QUANTIDADE
    // -------------------------------------------------
    function aumentarQuantidade(id) {
        setItens(prev => {
            const listaNova = prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantidade: item.quantidade + 1,
                        subtotal: (item.quantidade + 1) * item.preco
                    }
                    : item
            );

            calcularTotal(listaNova);
            return listaNova;
        });
    }

    // -------------------------------------------------
    // DIMINUIR QUANTIDADE
    // -------------------------------------------------
    function diminuirQuantidade(id) {
        setItens(prev => {
            const item = prev.find(i => i.id === id);
            if (!item) return prev;

            // Se tiver apenas 1, remove
            if (item.quantidade === 1) {
                const listaNova = prev.filter(i => i.id !== id);
                calcularTotal(listaNova);
                return listaNova;
            }

            const listaNova = prev.map(i =>
                i.id === id
                    ? {
                        ...i,
                        quantidade: i.quantidade - 1,
                        subtotal: (i.quantidade - 1) * i.preco
                    }
                    : i
            );

            calcularTotal(listaNova);
            return listaNova;
        });
    }

    // -------------------------------------------------
    // REMOVER ITEM INTEIRO
    // -------------------------------------------------
    function removerItem(id) {
        setItens(prev => {
            const listaNova = prev.filter(item => item.id !== id);
            calcularTotal(listaNova);
            return listaNova;
        });
    }

    // -------------------------------------------------
    // LIMPAR TUDO
    // -------------------------------------------------
    function limparVenda() {
        setItens([]);
        setProdutoAtual(null);
        setTotal(0);
    }

    return (
        <VendaContext.Provider value={{
            produtoAtual,
            setProdutoAtual,
            itens,
            adicionarItem,
            aumentarQuantidade,
            diminuirQuantidade,
            removerItem,
            total,
            limparVenda
        }}>
            {children}
        </VendaContext.Provider>
    );
}

export function useVenda() {
    return useContext(VendaContext);
}
