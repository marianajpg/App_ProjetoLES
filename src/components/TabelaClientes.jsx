import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import imageExcluir from "../images/image9.png";
import imageEditar from "../images/image8.png";
import { deleteCustomer } from "../services/customers.jsx";

const TabelaClientes = ({ clientes, setClientes }) => {
  const handleExcluirCliente = async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este cliente?"
    );
    if (!confirmar) return;

    try {
      await deleteCustomer(id);
      setClientes((prevClientes) =>
        prevClientes.filter((cliente) => cliente.id !== id)
      );
      alert("Cliente excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert("Erro ao excluir cliente. Tente novamente.");
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "-";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Função para formatar telefone
  const formatarTelefone = (telefone) => {
    if (!telefone) return "-";
    // Formata como (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
    return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
  };

  return (
    <div className="tabela-container">
      {clientes.length === 0 ? (
        <div className="sem-clientes">
          <img
            src="/src/images/image-nenhumProduto.png"
            alt="Nenhum cliente encontrado"
            className="no-pedidos-img"
          />
          <p>Nenhum cliente encontrado nesta categoria.</p>
        </div>
      ) : (
        <table className="tabela-clientes">
          <thead>
            <tr>
              <th>NOME COMPLETO</th>
              <th>CPF</th>
              <th>DATA DE NASCIMENTO</th>
              <th>TELEFONE</th>
              <th>E-MAIL</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="linha-cliente">
                <td data-label="Nome Completo">{cliente.name || "-"}</td>
                <td data-label="CPF">{cliente.cpf || "-"}</td>
                <td data-label="Data Nasc.">
                  {formatarData(cliente.birthdaydate)}
                </td>
                <td data-label="Telefone">{formatarTelefone(cliente.phone)}</td>
                <td data-label="E-mail">{cliente.email || "-"}</td>
                <td data-label="Ações" className="celula-acoes">
                  <Link
                    to={`/consultar-cliente/editar-cliente/${cliente.id}`}
                    state={{ cliente }}
                    className="botao-acao"
                    title="Editar cliente"
                    data-cy={`edit-customer-${cliente.id}`}
                  >
                    <img
                      src={imageEditar}
                      alt="Editar"
                      className="acao-imagem"
                    />
                  </Link>
                  <button
                    onClick={() => handleExcluirCliente(cliente.id)}
                    className="botao-acao"
                    title="Excluir cliente"
                  >
                    <img
                      src={imageExcluir}
                      alt="Excluir"
                      className="acao-imagem"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TabelaClientes;
