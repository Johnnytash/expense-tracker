import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "../../utils/helpers";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const FinancialPieChart = ({ transactions }) => {
  const data = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const existingEntry = acc.find((entry) => entry.name === transaction.tag);
      if (existingEntry) {
        existingEntry.value += transaction.amount;
      } else {
        acc.push({ name: transaction.tag, value: transaction.amount });
      }
      return acc;
    }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default FinancialPieChart;
