/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Typography, Grid, Divider, MenuItem, styled } from "@mui/material";
import {
  FormContainer,
  StyledTextField,
  StyledButton,
  Logo,
  FederatedButton,
} from "./shared.js";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { africanCountries, IUser } from "../../types";
import logoImg from "../../assets/logo.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useUserActions } from "../../actions";
import { holdings } from "../../utils";

const StyledPhoneInput = styled(PhoneInput)(({ theme }) => ({
  "& .form-control": {
    width: "100%",
    height: "56px",
    fontSize: "1rem",
    borderRadius: theme.shape.borderRadius,
    padding: "16.5px 14px",
    paddingLeft: "48px",
    borderColor:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.23)"
        : "rgba(255, 255, 255, 0.23)",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      borderColor: theme.palette.text.primary,
    },
    "&:focus": {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
      boxShadow: `${theme.palette.primary.main} 0 0 0 1px`,
    },
  },
  "& .flag-dropdown": {
    backgroundColor: "transparent",
    border: "none",
    color: theme.palette.text.secondary,
    "& .selected-flag": {
      backgroundColor: "transparent",
      "&:hover, &:focus": {
        backgroundColor: "transparent",
      },
    },
  },
}));

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { createHoldings, createDID } = useUserActions();

  const [formData, setFormData] = useState<IUser>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dateOfBirth: "",
    country: "",
    phoneNumber: "",
    idDocument: null,
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "idDocument") {
      const files = e.target.files;
      if (files) {
        setFormData({ ...formData, idDocument: files[0] });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handlePhoneChange = (value: string, country: any) => {
    setFormData({ ...formData, phoneNumber: value, country: country.name });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      let idDocumentUrl = "";
      if (formData.idDocument) {
        const storageRef = ref(storage, `idDocuments/${user.uid}`);
        await uploadBytes(storageRef, formData.idDocument);
        idDocumentUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        idDocumentUrl,
      });
      await createDID(user.uid);
      await createHoldings(user.uid, holdings);
      navigate("/auth/checkin");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          fullName: user.displayName,
          email: user.email,
        },
        { merge: true }
      );
      await createDID(user.uid);
      await createHoldings(user.uid, holdings);
      navigate("/auth/checkin");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <FormContainer>
      <Logo src={logoImg} alt="Apore" />
      <Typography variant="h3" gutterBottom fontFamily="'Poppins', sans-serif">
        Sign Up for Apore Vault
      </Typography>

      <FederatedButton variant="outlined" onClick={handleGoogleSignup}>
        <svg
          xmlns="https://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
          />
          <path
            fill="#34A853"
            d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
          />
          <path
            fill="#FBBC05"
            d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
          />
          <path
            fill="#EA4335"
            d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
          />
          <path fill="none" d="M2 2h44v44H2z" />
        </svg>
        Sign up with Google
      </FederatedButton>

      <Divider style={{ width: "100%", margin: "20px 0" }}>or</Divider>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Full Name"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledPhoneInput
              country={"za"}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputProps={{
                name: "phoneNumber",
                required: true,
                autoFocus: true,
              }}
              countryCodeEditable={false}
              onlyCountries={africanCountries.map((country) =>
                country.code.toLowerCase()
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              select
              fullWidth
              label="Country"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
            >
              {africanCountries.map((country) => (
                <MenuItem key={country.code} value={country.name}>
                  <span>{country.name}</span>
                </MenuItem>
              ))}
            </StyledTextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              required
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        {error && (
          <Typography color="error" align="center" style={{ marginTop: 10 }}>
            {error}
          </Typography>
        )}
        <StyledButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Sign Up
        </StyledButton>
      </form>

      <Typography variant="body2" style={{ marginTop: 20 }}>
        Already have an account?{" "}
        <Typography
        variant="body2"
          component="span"
          color="primary"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/auth/login")}
        >
          Log in
        </Typography>
      </Typography>
    </FormContainer>
  );
};

export default Signup;
