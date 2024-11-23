import React from 'react';
import axios from 'axios';

const TransactionList = ({ transactions, setTransactions, setSelectedTransaction }) => {
    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
        setTransactions(transactions.filter(t => t.transaction_id !== id));
    };

    return (
        <ul>
            {transactions.map(transaction => (
                <li key={transaction.transaction_id}>
                    {transaction.amount} - {transaction.transaction_type} - {transaction.status}
                    <button onClick={() => setSelectedTransaction(transaction)}>Edit</button>
                    <button onClick={() => handleDelete(transaction.transaction_id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
};

export default TransactionList;
