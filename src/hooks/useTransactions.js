import { useState, useEffect } from "react";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../utils/api";

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const addNewTransaction = async (transaction) => {
    try {
      const newTransaction = await addTransaction(transaction);
      setTransactions([...transactions, newTransaction]);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const updateExistingTransaction = async (id, transaction) => {
    try {
      const updatedTransaction = await updateTransaction(id, transaction);
      setTransactions(
        transactions.map((t) => (t.id === id ? updatedTransaction : t))
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const deleteExistingTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return {
    transactions,
    addTransaction: addNewTransaction,
    updateTransaction: updateExistingTransaction,
    deleteTransaction: deleteExistingTransaction,
  };
};

export default useTransactions;
