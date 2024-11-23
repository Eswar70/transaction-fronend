import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ transactions, setTransactions, selectedTransaction, setSelectedTransaction }) => {
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('DEPOSIT');
    const [senderName, setSenderName] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [status, setStatus] = useState('PENDING');

    useEffect(() => {
        if (selectedTransaction) {
            setAmount(selectedTransaction.amount);
            setTransactionType(selectedTransaction.transaction_type);
            setSenderName(selectedTransaction.sender_name);
            setReceiverName(selectedTransaction.receiver_name);
            setStatus(selectedTransaction.status);
        }
    }, [selectedTransaction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !senderName || !receiverName) {
            alert('All fields are required!');
            return;
        }

        const newTransaction = {
            user_id: Date.now(),
            amount,
            transaction_type: transactionType,
            sender_name: senderName,
            receiver_name: receiverName,
            status,
            timestamp: new Date().toISOString(),
        };

        const updatedTransactions = selectedTransaction
            ? transactions.map((t) =>
                  t.user_id === selectedTransaction.user_id ? newTransaction : t
              )
            : [...transactions, newTransaction];

        setTransactions(updatedTransactions);
        setAmount('');
        setSenderName('');
        setReceiverName('');
        setStatus('PENDING');
        setTransactionType("DEPOSIT");
        setSelectedTransaction(null); // Reset form after saving
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <input
                type="text"
                placeholder="Sender Name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Receiver Name"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAWAL">Withdrawal</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
            </select>
            <button type="submit">{selectedTransaction ? 'Update' : 'Add'} Transaction</button>
        </form>
    );
};

export default TransactionForm;
