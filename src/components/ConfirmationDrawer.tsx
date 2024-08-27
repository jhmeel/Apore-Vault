import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Drawer,
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Avatar,
} from '@mui/material';
import toast from 'react-hot-toast';
import { Ioffering } from '../types';

const DrawerContent = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 500,
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const CurrencyAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  fontSize: '1rem',
  fontWeight:1000,
  marginRight: theme.spacing(1),
}));

interface ConfirmationDrawerProps {
  open: boolean;
  offering: Ioffering|null;
  onClose: () => void;
}

const ConfirmationDrawer: React.FC<ConfirmationDrawerProps> = ({
  open,
  offering,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate transaction processing
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      toast.success('Transaction completed successfully!');
    }, 2000);
  };

  if (!offering) return null;

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <DrawerContent>
        <Typography variant="h2" gutterBottom>
          Confirm Transaction
        </Typography>
        <Grid container alignItems="center" spacing={2} mb={2}>
          <Grid item>
            <CurrencyAvatar>{offering.data.payin.currencyCode}</CurrencyAvatar>
          </Grid>
          <Grid item>
            <Typography variant="h3">
              {offering.data.payin.currencyCode} to {offering.data.payout.currencyCode}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="body1" gutterBottom>
          Exchange Rate: {offering.data.payoutUnitsPerPayinUnit}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Fee: {Number(offering.data.payoutUnitsPerPayinUnit)}
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            fullWidth
            disabled={isProcessing}
            size="large"
          >
            {isProcessing ? <CircularProgress size={24} /> : 'Confirm Transaction'}
          </Button>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default ConfirmationDrawer;