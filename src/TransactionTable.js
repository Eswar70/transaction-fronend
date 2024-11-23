import React from 'react';
import './TransactionTable.css';

const TransactionTable = ({
    transactions,
    setTransactions,
    setSelectedTransaction,
    handleAlertMessage,
}) => {
    // Initialize balance tracker for all users
    const balanceTracker = {};

    // Group transactions by sender and receiver
    const groupedData = transactions.reduce((acc, transaction) => {
        const { sender_name, receiver_name, amount, transaction_type, status } = transaction;
        const parsedAmount = parseFloat(amount);

        // Initialize balances for new users
        if (!balanceTracker[sender_name]) {
            balanceTracker[sender_name] = { sent: 0, received: 0, balance: 0 };
        }
        if (!balanceTracker[receiver_name]) {
            balanceTracker[receiver_name] = { sent: 0, received: 0, balance: 0 };
        }

        // Update balances based on transaction type and status
        if (status === 'COMPLETED') {
            if (transaction_type === 'DEPOSIT') {
                balanceTracker[sender_name].sent += parsedAmount;
                balanceTracker[sender_name].balance += parsedAmount; // Increase sender's balance
            } else if (transaction_type === 'WITHDRAWAL') {
                balanceTracker[sender_name].received += parsedAmount;
                balanceTracker[sender_name].balance -= parsedAmount; // Decrease sender's balance
            }
        }

        // Create a unique key for the sender and receiver
        const key = `${sender_name}-${receiver_name}`;
        if (!acc[key]) {
            acc[key] = {
                sender_name,
                receiver_name,
                totalSent: balanceTracker[sender_name].sent,
                totalReceived: balanceTracker[sender_name].received,
                transactionType: transaction_type,
                balance: balanceTracker[sender_name].balance,
                status,
            };
        } else {
            // Update existing group's totals and balance
            if (transaction_type === 'DEPOSIT') {
                acc[key].totalSent += parsedAmount;
                acc[key].balance = balanceTracker[sender_name].balance;
            } else if (transaction_type === 'WITHDRAWAL') {
                acc[key].totalReceived += parsedAmount;
                acc[key].balance = balanceTracker[sender_name].balance;
            }
            acc[key].transactionType = transaction_type; // Update the transaction type
            acc[key].status = status; // Update the status
        }

        return acc;
    }, {});

    // Convert grouped data into an array for rendering
    const groupedTransactions = Object.values(groupedData);

    const handleDelete = (key) => {
        // Delete all transactions for the selected group
        const updatedTransactions = transactions.filter((transaction) => {
            const currentKey = `${transaction.sender_name}-${transaction.receiver_name}`;
            return currentKey !== key;
        });
        setTransactions(updatedTransactions);
        handleAlertMessage('Transaction group deleted successfully!');
    };

    return (
        <div className="table-container">
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Total Sent</th>
                        <th>Total Received</th>
                        <th>Transaction Type</th>
                        <th>Remaining Balance</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {groupedTransactions.map((group, index) => {
                        const {
                            sender_name,
                            receiver_name,
                            totalSent,
                            totalReceived,
                            transactionType,
                            balance,
                            status,
                        } = group;

                        return (
                            <tr key={`${sender_name}-${receiver_name}`}>
                                <td>{index + 1}</td>
                                <td>{sender_name}</td>
                                <td>{receiver_name}</td>
                                <td>${totalSent.toFixed(2)}</td>
                                <td>${totalReceived.toFixed(2)}</td>
                                <td>{transactionType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}</td>
                                <td>${balance.toFixed(2)}</td>
                                <td>{status}</td>
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => setSelectedTransaction(group)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(`${sender_name}-${receiver_name}`)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
