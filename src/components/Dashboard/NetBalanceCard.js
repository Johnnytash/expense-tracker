import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { formatCurrency } from "../../utils/helpers";

const NetBalanceCard = ({ balance, onReset }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Net Balance
        </Typography>
        <Typography
          variant="h4"
          component="div"
          color={balance >= 0 ? "success.main" : "error.main"}>
          {formatCurrency(balance)}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onReset}>
            Reset
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NetBalanceCard;
