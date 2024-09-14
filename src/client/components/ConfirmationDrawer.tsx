/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Ioffering, ITransaction, ITxType } from "../types";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { getExchangeAmount, transactionFeeCalculator } from "../utils";
import { useUserActions } from "../actions";
import { NoificationType } from "../types";
import { v4 as uuidv4 } from "uuid";
import RatingModal from "./RatingModal";
import {
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

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
  narration: string;
  recipientAddress?: string;
  fromAddress?: string;
  currencyCode?: string;
  onClose: () => void;
}

const ConfirmationDrawer: React.FC<ConfirmationDrawerProps> = ({
  open,
  offering,
  txType,
  amount,
  narration,
  recipientAddress,
  fromAddress,
  currencyCode,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { notifyUser, createTxRecord, updateTxStatus } = useUserActions();
  const { user } = useAuth();

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

      const txRef = uuidv4();
      const tx: ITransaction = {
        reference: txRef,
        from: fromAddress || "YOU",
        to: recipientAddress,
        type: txType,
        amount: amount,
        currencyCode,
        timestamp: new Date(),
        status: "processing",
        narration,
        data: "",
        metadata: "",
        liquidityProvider: offering?.metadata.from,
      };

      await createTxRecord(tx);

      setActiveStep(2);

      await updateTxStatus(txRef, "completed");
      notifyUser({
        id: uuidv4(),
        type: NoificationType.TX_SUCCESS,
        title: NoificationType.TX_SUCCESS,
        content: "Your Transaction has been completed",
      });

      setIsProcessing(false);
      onClose();
      toast.success("Transaction completed successfully!");

      const userDocRef = doc(db, "users", user?.uid);
      const userDoc = await getDoc(userDocRef);
      const userRatings = userDoc.data()?.ratings || [];
      const hasRated = userRatings.some(
        (rating: any) => rating.liquidityProvider === offering?.metadata.from
      );

      if (!hasRated) {
        setShowRatingModal(true);
      }
    } catch (err: any) {
      toast.error(err.message);
      setIsProcessing(false);
    }
  };

  const handleSubmitRating = async (rating: number) => {
    try {
      const userDocRef = doc(db, "users", user?.uid);

      await updateDoc(userDocRef, {
        ratings: arrayUnion({
          liquidityProvider: offering?.metadata.from,
          rating: rating,
          timestamp: new Date(),
        }),
      });

      const lpDocRef = doc(db, "liquidityProviders", offering?.metadata.from);
      await runTransaction(db, async (transaction) => {
        const lpDoc = await transaction.get(lpDocRef);

        if (!lpDoc.exists()) {
          // Create new document for the liquidity provider
          transaction.set(lpDocRef, {
            ratings: [rating],
            totalRatings: 1,
            averageRating: rating,
            createdAt: serverTimestamp(),
          });
        } else {
          // Update existing document
          const lpData = lpDoc.data();
          const newTotalRatings = (lpData.totalRatings || 0) + 1;
          const newAverageRating =
            ((lpData.averageRating || 0) * (newTotalRatings - 1) + rating) /
            newTotalRatings;

          transaction.update(lpDocRef, {
            ratings: arrayUnion(rating),
            totalRatings: newTotalRatings,
            averageRating: newAverageRating,
            updatedAt: serverTimestamp(),
          });
        }
      });

      toast.success("Thank you for your feedback!");
    } catch (error: any) {
      toast.error("Failed to submit rating. Please try again later.");
    }
  };

  const steps = ["Confirm", "Processing", "Complete"];

  if (!offering) return null;

  return (
    <>
      <Drawer anchor="bottom" open={open} onClose={onClose}>
        <DrawerContent>
          <StyledIconButton onClick={onClose}>
            <CloseIcon />
          </StyledIconButton>
          <Fade in={true} timeout={500}>
            <StyledTypography variant="h5" align="center">
              {txType === "CONVERT"
                ? "Confirm Exchange"
                : "Confirm Transaction"}
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
            <Grid
              container
              alignItems="center"
              spacing={2}
              justifyContent="center"
            >
              <Grid item>
                <Typography variant="h5">
                  {offering?.data.payin?.currencyCode}
                </Typography>
              </Grid>
              <Grid item>
                <Fade in={true} timeout={800}>
                  {txType !== "CONVERT" ? (
                    <ArrowRightAltIcon fontSize="large" />
                  ) : (
                    <SwapHorizIcon fontSize="large" />
                  )}
                </Fade>
              </Grid>
              <Grid item>
                <Typography variant="h5">
                  {offering?.data?.payout?.currencyCode}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body1" align="center" mt={2}>
              {txType === "CONVERT"
                ? `Exchange ${amount} ${
                    offering?.data?.payin?.currencyCode
                  } for ${getExchangeAmount(amount, offering)} ${
                    offering?.data?.payout?.currencyCode
                  }`
                : `Send ${amount} ${offering?.data?.payout?.currencyCode} to ${recipientAddress}`}
            </Typography>
          </Box>
          <Collapse in={showDetails}>
            <Box p={2} bgcolor="rgba(0, 0, 0, 0.03)" borderRadius={1}>
              <Typography variant="body2" gutterBottom>
                Exchange Rate: {offering.data.payoutUnitsPerPayinUnit}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Fee:{" "}
                {amount &&
                  `${transactionFeeCalculator
                    .calculateTransactionFee({
                      transactionAmount: amount,
                      payin: offering?.data?.payin?.currencyCode,
                      payout: offering?.data?.payout?.currencyCode,
                      exchangeRate: offering?.data?.payoutUnitsPerPayinUnit,
                    })
                    .toString()} ${offering?.data?.payin?.currencyCode}`}
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
      <RatingModal
        open={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmitRating={handleSubmitRating}
        liquidityProvider={offering.metadata.from}
      />
    </>
  );
};

export default ConfirmationDrawer;
