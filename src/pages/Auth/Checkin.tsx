import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  Link,
  Container,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { db, auth } from "../../firebase";
import toast from "react-hot-toast";
import logoImg from "../../assets/logo.png";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PinInput = styled("input")(({ theme }) => ({
  width: "40px",
  height: "50px",
  fontSize: "24px",
  textAlign: "center",
  margin: "0 4px",
  border: "none",
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  transition: "all 0.3s ease",
  backgroundColor: "transparent",
  color: theme.palette.text.primary,
  "&:focus": {
    outline: "none",
    borderColor: theme.palette.secondary.main,
    transform: "translateY(-2px)",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  width: "100%",
  maxWidth: 450,
  borderRadius: "20px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
}));

const Logo = styled("img")({
  width: "120px",
  marginBottom: "20px",
});

const StyledButton = styled("button")(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: "12px 24px",
  fontSize: "14px",
  border: "none",
  borderRadius: "30px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const Checkin: React.FC = () => {
  const { user, userDetails } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [hasPin, setHasPin] = useState(false);
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const [email, setEmail] = useState("");
  const [showForgotPin, setShowForgotPin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPin = async () => {
      if (!user) {
        navigate("/auth/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user?.uid));
      if (userDoc.exists() && userDoc.data().accessPin) {
        setHasPin(true);
        setIsCreatingPin(false);
      } else {
        setHasPin(false);
        setIsCreatingPin(true);
      }
      setLoading(false);
    };
    checkPin();
  }, [user, navigate]);

  const handlePinChange = (
    index: number,
    value: string,
    isConfirm: boolean = false
  ) => {
    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value;
    isConfirm ? setConfirmPin(newPin) : setPin(newPin);

    if (value !== "" && index < 3) {
      const nextInput = document.getElementById(
        `pin-${isConfirm ? "confirm-" : ""}${index + 1}`
      );
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredPin = pin.join("");
    if (isCreatingPin) {
      const confirmedPin = confirmPin.join("");
      if (enteredPin !== confirmedPin) {
        toast.error("PINs do not match. Please try again.");
        setConfirmPin(["", "", "", ""]);
        return;
      }
      try {
        await setDoc(
          doc(db, "users", user!.uid),
          { accessPin: enteredPin, enabled2F: true },
          { merge: true }
        );
        toast.success("PIN created successfully and 2FA enabled");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Error creating PIN. Please try again.");
      }
    } else {
      if (enteredPin === userDetails?.accessPin) {
        navigate("/dashboard");
      } else {
        toast.error("Incorrect PIN. Please try again.");
        setPin(["", "", "", ""]);
      }
    }
  };

  const handleForgotPin = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link sent to your email");
      setShowForgotPin(false);
    } catch (error) {
      toast.error("Error sending reset link. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      <Logo src={logoImg} alt="Apore" />
      <StyledPaper elevation={0}>
        <Typography
          variant="h5"
          gutterBottom
          fontFamily="'Poppins', sans-serif"
          sx={{ fontWeight: "bold", color: "primary.main", textAlign: "center" }}
        >
          {isCreatingPin
            ? "Create Your PIN"
            : `Welcome Back, ${userDetails?.fullName.split(" ")[0]} 👋`}
        </Typography>
        {!showForgotPin && (
          <Grid container direction="column" spacing={3}>
            {isCreatingPin ? (
              <>
                {!pin[3] && <Grid item>
                  <Typography variant="body2" align="center" gutterBottom>
                    Choose a 4-digit PIN
                  </Typography>
                  <Box display="flex" justifyContent="center" mt={1}>
                    {pin.map((digit, index) => (
                      <PinInput
                        key={`create-${index}`}
                        id={`pin-${index}`}
                        type="password"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                      />
                    ))}
                  </Box>
                </Grid>}
               {pin[3] && <Grid item>
                  <Typography variant="body2" align="center" gutterBottom>
                    Confirm your PIN
                  </Typography>
                  <Box display="flex" justifyContent="center" mt={1}>
                    {confirmPin.map((digit, index) => (
                      <PinInput
                        key={`confirm-${index}`}
                        id={`pin-confirm-${index}`}
                        type="password"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(index, e.target.value, true)}
                      />
                    ))}
                  </Box>
                </Grid>}
              </>
            ) : (
              <Grid item>
                <Typography variant="body2" align="center" gutterBottom>
                  Enter your 4-digit PIN
                </Typography>
                <Box display="flex" justifyContent="center" mt={1}>
                  {pin.map((digit, index) => (
                    <PinInput
                      key={index}
                      id={`pin-${index}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                    />
                  ))}
                </Box>
              </Grid>
            )}
            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
              <StyledButton
                onClick={handleSubmit}
                disabled={
                  (isCreatingPin
                    ? [...pin, ...confirmPin]
                    : pin
                  ).some((digit) => digit === "")
                }
              >
                <LockOpenIcon sx={{ mr: 1 }} />
                {isCreatingPin ? "Create PIN" : "Login"}
              </StyledButton>
            </Grid>
            {!isCreatingPin && (
              <Grid item sx={{ textAlign: "center" }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setShowForgotPin(true)}
                  sx={{ cursor: "pointer", color: "secondary.main" }}
                >
                  Forgot PIN?
                </Link>
              </Grid>
            )}
          </Grid>
        )}
        
        {showForgotPin && (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              fontFamily="'Poppins', sans-serif"
              sx={{ textAlign: "center" }}
            >
              Reset Your PIN
            </Typography>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton onClick={() => setShowForgotPin(false)}>
                <ArrowBackIcon />
              </IconButton>
              <StyledButton onClick={handleForgotPin}>
                Send Reset Link
              </StyledButton>
            </Box>
          </Box>
        )}
      </StyledPaper>
    </Container>
  );
};

export default Checkin;