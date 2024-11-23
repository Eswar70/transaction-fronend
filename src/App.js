import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import ThemeToggle from './ThemeToggle';
import './App.css';

const App = () => {
    const [transactions, setTransactions] = useState([]);
    const [totals, setTotals] = useState({}); // Store total sent/received amounts per user
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [theme, setTheme] = useState('light');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const storedTotals = JSON.parse(localStorage.getItem('totals')) || {};
        setTransactions(storedTransactions);
        setTotals(storedTotals);

        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }, []);

    const saveToLocalStorage = (data, totalsData) => {
        localStorage.setItem('transactions', JSON.stringify(data));
        localStorage.setItem('totals', JSON.stringify(totalsData));
    };

    const updateTotals = (transactions) => {
        const totals = {};
    
        transactions.forEach((transaction) => {
            const { sender_name, receiver_name, amount, transaction_type, status } = transaction;
    
            if (status === 'COMPLETED') {
                if (!totals[sender_name]) {
                    totals[sender_name] = { sent: 0, received: 0 };
                }
                if (!totals[receiver_name]) {
                    totals[receiver_name] = { sent: 0, received: 0 };
                }
    
                // Update totals based on transaction type
                if (transaction_type === 'DEPOSIT') {
                    totals[sender_name].sent += parseFloat(amount);
                } else if (transaction_type === 'WITHDRAWAL') {
                    totals[receiver_name].received += parseFloat(amount);
                }
            }
        });
    
        setTotals(totals);
        return totals;
    };
    

    const handleUpdateTransactions = (updatedTransactions) => {
        const updatedTotals = updateTotals(updatedTransactions);
        setTransactions(updatedTransactions);
        saveToLocalStorage(updatedTransactions, updatedTotals);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleAlertMessage = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(''), 2000);
    };

    return (
        <div className={`app-container ${theme}`}>
            <h1>Transaction Management System</h1>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <TransactionForm
                transactions={transactions}
                setTransactions={handleUpdateTransactions}
                selectedTransaction={selectedTransaction}
                setSelectedTransaction={setSelectedTransaction}
            />
            <TransactionTable
                transactions={transactions}
                totals={totals}
                setTransactions={handleUpdateTransactions}
                setSelectedTransaction={setSelectedTransaction}
                handleAlertMessage={handleAlertMessage}
            />
            {alertMessage && <div className="alert-popup">{alertMessage}</div>}
        </div>
    );
};

export default App;
