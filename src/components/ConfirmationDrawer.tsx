import React, { useState, useEffect } from "react";
import { styled, keyframes } from "@mui/material/styles";
import {
  Drawer,
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  Fade,
  IconButton,
  Tooltip,
} from "@mui/material";
import toast from "react-hot-toast";
import { Ioffering, ITxType } from "../types";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { getExchangeAmount } from "../utils";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DrawerContent = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 500,
  margin: "0 auto",
  padding: theme.spacing(3),
  animation: `${fadeIn} 0.3s ease-out`,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const AnimatedDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  animation: `${fadeIn} 0.5s ease-out`,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
}));

interface ConfirmationDrawerProps {
  open: boolean;
  offering: Ioffering | null;
  txType: ITxType;
  amount: string;
  recipientAddress?: string;
  onClose: () => void;
}

const ConfirmationDrawer: React.FC<ConfirmationDrawerProps> = ({
  open,
  offering,
  txType,
  amount,
  recipientAddress,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setShowDetails(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      setActiveStep(1);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulating transaction processing
      console.log(txType, amount, recipientAddress);
      setActiveStep(2);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsProcessing(false);
      onClose();
      toast.success("Transaction completed successfully!");
    } catch (err: any) {
      toast.error(err.message);
      setIsProcessing(false);
    }
  };

  const steps = ["Confirm", "Processing", "Complete"];

  if (!offering) return null;

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <DrawerContent>
        <StyledIconButton onClick={onClose}>
          <CloseIcon />
        </StyledIconButton>
        <Fade in={true} timeout={500}>
          <StyledTypography variant="h5" align="center">
            {txType === "CONVERT" ? "Confirm Exchange" : "Confirm Transaction"}
          </StyledTypography>
        </Fade>
        <AnimatedDivider />
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <AnimatedDivider />
        <Box mb={2}>
          <Grid container alignItems="center" spacing={2} justifyContent="center">
            <Grid item>
              <Typography variant="h5">{offering?.data.payin?.currencyCode}</Typography>
            </Grid>
            <Grid item>
              <Fade in={true} timeout={800}>
                {txType !== "CONVERT" ? <ArrowRightAltIcon fontSize="large" /> : <SwapHorizIcon fontSize="large" />}
              </Fade>
            </Grid>
            <Grid item>
              <Typography variant="h5">{offering?.data?.payout?.currencyCode}</Typography>
            </Grid>
          </Grid>
          <Typography variant="body1" align="center" mt={2}>
            {txType === "CONVERT"
              ? `Exchange ${amount} ${offering?.data?.payin?.currencyCode} for ${getExchangeAmount(amount, offering)} ${offering?.data?.payout?.currencyCode}`
              : `Send ${amount} ${offering?.data?.payout?.currencyCode} to ${recipientAddress}`}
          </Typography>
        </Box>
        <Collapse in={showDetails}>
          <Box p={2} bgcolor="rgba(0, 0, 0, 0.03)" borderRadius={1}>
            <Typography variant="body2" gutterBottom>
              Exchange Rate: {offering.data.payoutUnitsPerPayinUnit}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Fee: {Number(offering.data.payoutUnitsPerPayinUnit)}
            </Typography>
          </Box>
        </Collapse>
        <Box mt={2} display="flex" justifyContent="center">
          <Tooltip title={showDetails ? "Hide details" : "Show details"}>
            <Button
              variant="outlined"
              startIcon={<InfoOutlinedIcon />}
              onClick={() => setShowDetails(!showDetails)}
              size="small"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </Tooltip>
        </Box>
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            fullWidth
            disabled={isProcessing}
            size="large"
          >
            {isProcessing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirm Transaction"
            )}
          </Button>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default ConfirmationDrawer;