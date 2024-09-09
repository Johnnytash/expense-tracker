import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  AppBar,
  Toolbar,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../utils/api";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const Login = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const data = await login(values);
        authLogin(data);
        navigate("/dashboard");
      } catch (error) {
        setError(
          error.response?.data?.error || "An error occurred during login"
        );
      }
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: "#4E31AA" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ExpenSync
          </Typography>
          <Typography variant="h6" component="div">
            Please Login
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1, width: "100%" }}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Logging In..." : "Log In"}
            </Button>
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link component={RouterLink} to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
