import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const validationSchema = Yup.object({
  name: Yup.string().required("Description is required"),
  amount: Yup.number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  date: Yup.date().required("Date is required"),
  tag: Yup.string().required("Tag is required"),
  type: Yup.string().required("Type is required"),
});

const EditTransactionModal = ({
  open,
  onClose,
  transaction,
  onEditTransaction,
}) => {
  console.log("EditTransactionModal props:", {
    open,
    transaction,
    onEditTransaction,
  });

  const formik = useFormik({
    initialValues: {
      name: transaction?.name || "",
      amount: transaction?.amount || "",
      date: transaction?.date || "",
      tag: transaction?.tag || "",
      type: transaction?.type || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      if (typeof onEditTransaction === "function") {
        onEditTransaction({ ...transaction, ...values });
      } else {
        console.error("onEditTransaction is not a function", onEditTransaction);
      }
      onClose();
    },
    enableReinitialize: true,
  });

  if (!transaction) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Transaction</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Description"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
          />
          <TextField
            fullWidth
            id="amount"
            name="amount"
            label="Amount"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            margin="normal"
          />
          <TextField
            fullWidth
            id="date"
            name="date"
            label="Date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          <TextField
            fullWidth
            id="tag"
            name="tag"
            select
            label="Tag"
            value={formik.values.tag}
            onChange={formik.handleChange}
            error={formik.touched.tag && Boolean(formik.errors.tag)}
            helperText={formik.touched.tag && formik.errors.tag}
            margin="normal">
            <MenuItem value="salary">Salary</MenuItem>
            <MenuItem value="freelance">Freelance</MenuItem>
            <MenuItem value="investment">Investment</MenuItem>
            <MenuItem value="food">Food</MenuItem>
            <MenuItem value="utilities">Utilities</MenuItem>
            <MenuItem value="transportation">Transportation</MenuItem>
            <MenuItem value="entertainment">Entertainment</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            id="type"
            name="type"
            select
            label="Type"
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
            margin="normal">
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTransactionModal;
