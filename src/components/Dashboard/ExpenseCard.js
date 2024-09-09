import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { formatCurrency } from "../../utils/helpers";

const ExpenseCard = ({ totalExpenses, onAddExpense }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Total Expenses
        </Typography>
        <Typography variant="h4" component="div" color="error.main">
          {formatCurrency(totalExpenses)}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="secondary" onClick={onAddExpense}>
            Add Expense
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
