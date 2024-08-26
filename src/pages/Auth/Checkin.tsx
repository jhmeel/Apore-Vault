import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  Link,
  Fade,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { db, auth } from "../../firebase";
import toast from "react-hot-toast";
import logoImg from "../../assets/logo.png";

const PinInput = styled("input")(({ theme }) => ({
  width: "60px",
  height: "60px",
  fontSize: "28px",
  textAlign: "center",
  margin: "0 5px",
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: "12px",
  transition: "all 0.3s ease",
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
  backgroundColor: theme.palette.background.default,
}));

const Logo = styled("img")({
  width: "90px",
  marginBottom: "20px",
});

const StyledButton = styled("button")(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: "12px 24px",
  fontSize: "16px",
  border: "none",
  borderRadius: "30px",
  cursor: "pointer",
  transition: "all 0.3s ease",
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
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [email, setEmail] = useState("");
  const [showForgotPin, setShowForgotPin] = useState(false);

  useEffect(() => {
    const checkPin = async () => {
      if (!user) {
        navigate("/auth/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user?.uid));
      if (userDoc.exists() && userDoc.data().accessPin) {
        setHasPin(true);
      } else {
        setIsCreatingPin(true);
      }
    };
    checkPin();
  }, [user]);

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

    if (!isConfirm && index === 3 && value !== "") {
      setShowConfirmPin(true);
    }
  };

  const handleSubmit = async () => {
    const enteredPin = pin.join("");
    if (isCreatingPin) {
      const confirmedPin = confirmPin.join("");
      if (enteredPin !== confirmedPin) {
        toast.error("PINs do not match. Please try again.");
        setConfirmPin(["", "", "", ""])
        return;
      }
      try {
        await setDoc(
          doc(db, "users", user!.uid),
          { accessPin: enteredPin },
          { merge: true }
        );
        toast.success("PIN created successfully");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Error creating PIN. Please try again.");
      }
    } else {
      if (enteredPin === userDetails?.accessPin) {
        navigate("/dashboard");
      } else {
        toast.error("Incorrect PIN. Please try again.");
        setPin(["", "", "", ""])
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
      <Typography
        variant="h5"
        gutterBottom fontFamily="'Poppins', sans-serif"
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        {isCreatingPin
          ? "Create Your PIN"
          : `Welcome Back ${userDetails?.fullName.split(" ")[0]} 👋`}
      </Typography>
      <StyledPaper elevation={0}>
        {!showForgotPin && (
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="body1" align="center" gutterBottom>
                {isCreatingPin && !showConfirmPin && !showForgotPin
                  ? "Choose a 4-digit PIN"
                  : !showConfirmPin &&
                    !isCreatingPin &&
                    !showForgotPin &&
                    "Enter your 4-digit PIN"}
              </Typography>
              <Box display="flex" justifyContent="center" mt={2}>
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
            {isCreatingPin && showConfirmPin && (
              <Fade in={showConfirmPin} timeout={500}>
                <Grid item>
                  <Typography variant="body1" align="center" gutterBottom fontFamily="'Poppins', sans-serif">
                    Confirm your PIN
                  </Typography>
                  <Box display="flex" justifyContent="center" mt={2}>
                    {confirmPin.map((digit, index) => (
                      <PinInput
                        key={index}
                        id={`pin-confirm-${index}`}
                        type="password"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handlePinChange(index, e.target.value, true)
                        }
                      />
                    ))}
                  </Box>
                </Grid>
              </Fade>
            )}
            <Grid item>
              <StyledButton
                onClick={handleSubmit}
                disabled={
                  pin.some((digit) => digit === "") ||
                  (isCreatingPin &&
                    showConfirmPin &&
                    confirmPin.some((digit) => digit === ""))
                }
              >
                {isCreatingPin ? "Create PIN" : "Login"}
              </StyledButton>
            </Grid>
            {!isCreatingPin && !showConfirmPin && !showForgotPin && (
              <Grid item>
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
      </StyledPaper>
      {showForgotPin && !isCreatingPin && (
        <Fade in={showForgotPin} timeout={500}>
          <StyledPaper elevation={0} sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              gutterBottom fontFamily="'Poppins', sans-serif"
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
            <StyledButton onClick={handleForgotPin}>
              Send Reset Link
            </StyledButton>
          </StyledPaper>
        </Fade>
      )}
    </Container>
  );
};

export default Checkin;
