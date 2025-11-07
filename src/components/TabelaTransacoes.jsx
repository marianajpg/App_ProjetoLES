import React from 'react';

const TabelaTransacoes = ({ transacoes, onVerDetalhes }) => {
  return (
    <div className="transacoes-cliente">
      <table className="tabela-transacoes">
        <thead>
          <tr>
            <th>Data</th>
            <th>Desconto</th>
            <th>Valor Total</th>
            <th>Forma de Pagamento</th>
            <th>Status</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((transacao) => (
            <tr key={transacao.id}>
              <td>{transacao.data}</td>
              <td>{transacao.desconto}</td>
              <td>{transacao.valorTotal}</td>
              <td>{transacao.formaPagamento}</td>
              <td>{transacao.status}</td>
              <td>
                <button className="detalhes-botao" onClick={() => onVerDetalhes(transacao.id)}>{transacao.detalhes}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaTransacoes;