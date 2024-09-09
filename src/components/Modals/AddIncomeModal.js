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
});

const AddIncomeModal = ({ open, onClose, onAddIncome }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      tag: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onAddIncome(values);
      resetForm();
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Income</DialogTitle>
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
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Income
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddIncomeModal;
