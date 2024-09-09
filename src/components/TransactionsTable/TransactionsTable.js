import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { formatDate, formatCurrency } from "../../utils/helpers";
import EditTransactionModal from "../Modals/EditTransactionModal";

const TransactionsTable = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  setTransactions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState(null);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedTransactions = transactions
    .filter(
      (transaction) =>
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterType === "all" || transaction.type === filterType)
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleEdit = (transaction) => {
    console.log("Editing transaction:", transaction);
    setEditingTransaction(transaction);
  };

  const handleEditSubmit = (updatedTransaction) => {
    console.log("handleEditSubmit called with:", updatedTransaction);
    if (typeof onEditTransaction === "function") {
      onEditTransaction(updatedTransaction);
    } else {
      console.error("onEditTransaction is not a function", onEditTransaction);
    }
    setEditingTransaction(null);
  };

  const handleDelete = (id) => {
    setDeletingTransactionId(id);
  };

  const confirmDelete = () => {
    onDeleteTransaction(deletingTransactionId);
    setDeletingTransactionId(null);
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Type,Date,Amount,Tag\n" +
      transactions
        .map((t) => `${t.name},${t.type},${t.date},${t.amount},${t.tag}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
  };

  const importFromCSV = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n").slice(1); // Skip header row
      const importedTransactions = rows.map((row) => {
        const [name, type, date, amount, tag] = row.split(",");
        return {
          id: Date.now() + Math.random(), // Generate a unique ID
          name,
          type,
          date,
          amount: parseFloat(amount),
          tag,
        };
      });
      setTransactions([...transactions, ...importedTransactions]);
    };
    reader.readAsText(file);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Transactions
      </Typography>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Filter by Type"
          variant="outlined"
          size="small"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSort("date")}>
          Sort by Date
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSort("amount")}>
          Sort by Amount
        </Button>
        <Button variant="contained" color="primary" onClick={exportToCSV}>
          Export to CSV
        </Button>
        <Button variant="contained" color="primary" component="label">
          Import from CSV
          <input type="file" hidden onChange={importFromCSV} accept=".csv" />
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Tag</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>{transaction.tag}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(transaction)}
                    color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(transaction.id)}
                    color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditTransactionModal
        open={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onEditTransaction={handleEditSubmit}
      />
      <Dialog
        open={!!deletingTransactionId}
        onClose={() => setDeletingTransactionId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingTransactionId(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionsTable;
