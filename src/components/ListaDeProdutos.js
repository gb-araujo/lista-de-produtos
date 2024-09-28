import React, { useState, useEffect } from 'react';
import './ListaDeProdutos.css';
import firebase from './firebaseConfig';
import Navbar from './Navbar';
import ProductAPI from './daoTask';

let userId = null;

function ListaDeProdutos() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userId = user.uid;
        } else {
            window.location.href = "/cadastro";
        }
    });

    const [produtos, setProdutos] = useState([]);
    const [novoProduto, setNovoProduto] = useState('');
    const [novaQtde, setNovaQtde] = useState(''); // Adicionando estado para a quantidade
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsFromAPI = await ProductAPI.readProducts(userId);
                setProdutos(productsFromAPI);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchProducts();
    }, [userId]); // Removido produtos da dependência do useEffect, pois não é necessário recarregar quando produtos são atualizados

    const adicionarProduto = async () => {
        try {
            const newProductId = await ProductAPI.createProduct({ "descricao": novoProduto, "quantidade": novaQtde }, userId); // Incluindo a quantidade ao criar o produto
            const updatedProducts = [...produtos, { id: newProductId, descricao: novoProduto, quantidade: novaQtde }]; // Incluindo a quantidade no novo produto
            setProdutos(updatedProducts);
            setNovoProduto('');
            setNovaQtde('');
            setMostrarFormulario(false);
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
        }
    };

    const removerProduto = async (productId) => {
        try {
            await ProductAPI.deleteProduct(productId, userId);
            const updatedProducts = produtos.filter(product => product.id !== productId);
            setProdutos(updatedProducts);
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    };

    return (
        <div className="lista-de-produtos">
            <Navbar />
            <h1>Lista de Produtos</h1>
            <button className="botao-flutuante" onClick={() => setMostrarFormulario(true)}>
                <i className="fas fa-plus">+</i>
            </button>
            {mostrarFormulario && (
                <div className="adicionar-produto">
                    <input
                        type="text"
                        value={novoProduto}
                        onChange={(e) => setNovoProduto(e.target.value)}
                        placeholder="Digite um novo produto"
                    />
                    <input
                        type='number' // Alterando o tipo do input para number
                        value={novaQtde}
                        onChange={(e)=> setNovaQtde(e.target.value)}
                        placeholder="Quantidade"
                    />
                    <button onClick={adicionarProduto}>Adicionar</button>
                </div>
            )}
            <ul>
                {produtos.map(product => (
                    <li key={product.id} className="produto">
                        <div>{product.descricao} - {product.quantidade}</div> {/* Mostrando a descrição e a quantidade */}
                        <div className="remover-produto" onClick={() => removerProduto(product.id)}>
                            <i className="fas fa-trash-alt"></i> {/* Adicionado ícone de exclusão */}
                            <span>Remover</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaDeProdutos;
