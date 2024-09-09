import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { formatCurrency } from "../../utils/helpers";

const IncomeCard = ({ totalIncome, onAddIncome }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Total Income
        </Typography>
        <Typography variant="h4" component="div" color="success.main">
          {formatCurrency(totalIncome)}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={onAddIncome}>
            Add Income
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IncomeCard;
