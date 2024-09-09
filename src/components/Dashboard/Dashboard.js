import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../utils/api";
import NetBalanceCard from "./NetBalanceCard";
import IncomeCard from "./IncomeCard";
import ExpenseCard from "./ExpenseCard";
import AddIncomeModal from "../Modals/AddIncomeModal";
import AddExpenseModal from "../Modals/AddExpenseModal";
import FinancialLineChart from "../Charts/FinancialLineChart";
import FinancialPieChart from "../Charts/FinancialPieChart";
import TransactionsTable from "../TransactionsTable/TransactionsTable";

const Dashboard = () => {
  const { logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openResetConfirmDialog, setOpenResetConfirmDialog] = useState(false);

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

  const handleAddIncome = async (newTransaction) => {
    try {
      console.log("Adding income:", newTransaction);
      const addedTransaction = await addTransaction({
        ...newTransaction,
        type: "income",
      });
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        addedTransaction,
      ]);
      setOpenIncomeModal(false);
    } catch (error) {
      console.error("Error adding income:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleAddExpense = async (newTransaction) => {
    try {
      const addedTransaction = await addTransaction({
        ...newTransaction,
        type: "expense",
      });
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        addedTransaction,
      ]);
      setOpenExpenseModal(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      const editedTransaction = await updateTransaction(
        updatedTransaction.id,
        updatedTransaction
      );
      setTransactions((prevTransactions) =>
        prevTransactions.map((t) =>
          t.id === editedTransaction.id ? editedTransaction : t
        )
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions((prevTransactions) =>
        prevTransactions.filter((t) => t.id !== id)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleResetBalance = async () => {
    try {
      await Promise.all(transactions.map((t) => deleteTransaction(t.id)));
      setTransactions([]);
      setOpenResetConfirmDialog(false);
    } catch (error) {
      console.error("Error resetting balance:", error);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "#4E31AA",
          color: "white",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography variant="h4" component="h1" sx={{ cursor: "pointer" }}>
          ExpenSync
        </Typography>
        <Button variant="contained" color="secondary" onClick={logout}>
          Logout
        </Button>
      </Box>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <NetBalanceCard
              balance={netBalance}
              onReset={() => setOpenResetConfirmDialog(true)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <IncomeCard
              totalIncome={totalIncome}
              onAddIncome={() => setOpenIncomeModal(true)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ExpenseCard
              totalExpenses={totalExpenses}
              onAddExpense={() => setOpenExpenseModal(true)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Income vs Expenses Over Time
            </Typography>
            <FinancialLineChart transactions={transactions} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Spending by Category
            </Typography>
            <FinancialPieChart transactions={transactions} />
          </Grid>
          <Grid item xs={12}>
            <TransactionsTable
              transactions={transactions}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              setTransactions={setTransactions}
            />
          </Grid>
        </Grid>
        <AddIncomeModal
          open={openIncomeModal}
          onClose={() => setOpenIncomeModal(false)}
          onAddIncome={handleAddIncome}
        />
        <AddExpenseModal
          open={openExpenseModal}
          onClose={() => setOpenExpenseModal(false)}
          onAddExpense={handleAddExpense}
        />
        <Dialog
          open={openResetConfirmDialog}
          onClose={() => setOpenResetConfirmDialog(false)}>
          <DialogTitle>Confirm Reset</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to reset all transactions? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenResetConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetBalance} color="error">
              Reset
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;
