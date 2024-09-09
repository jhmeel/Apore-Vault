import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Rating,
  Box,
} from "@mui/material";
import { useUserActions } from "../actions";

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitRating: (rating: number) => void;
  liquidityProvider: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  open,
  onClose,
  onSubmitRating,
  liquidityProvider,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const { getPFIByDID } = useUserActions();

  const [providerName, setProviderName] = useState("");

  useEffect(() => {
    if (liquidityProvider) {
      getPFIByDID(liquidityProvider).then((prov) =>
        setProviderName(prov?.name)
      );
    }
  }, [liquidityProvider]);
  const handleSubmit = () => {
    if (rating !== null) {
      onSubmitRating(rating);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rate Your Experience</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          How would you rate your experience with {providerName}?
        </Typography>
        <Box display="flex" justifyContent="center" my={2}>
          <Rating
            name="liquidity-provider-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Maybe Later
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={rating === null}
        >
          Submit Rating
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingModal;
