import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatDate, formatCurrency } from "../../utils/helpers";

const FinancialLineChart = ({ transactions }) => {
  const data = transactions
    .reduce((acc, transaction) => {
      const date = formatDate(transaction.date);
      const existingEntry = acc.find((entry) => entry.date === date);
      if (existingEntry) {
        existingEntry[transaction.type] += transaction.amount;
      } else {
        acc.push({
          date,
          income: 0,
          expense: 0,
          [transaction.type]: transaction.amount,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FinancialLineChart;
