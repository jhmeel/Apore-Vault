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

const DrawerContent = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 500,
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const CurrencyAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  fontSize: '1.5rem',
  marginRight: theme.spacing(1),
}));

interface ConfirmationDrawerProps {
  open: boolean;
  offering: any;
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
            <CurrencyAvatar>{offering.fromAsset}</CurrencyAvatar>
          </Grid>
          <Grid item>
            <Typography variant="h3">
              {offering.fromAsset} to {offering.toAsset}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="body1" gutterBottom>
          Exchange Rate: {offering.exchangeRate}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Fee: {offering.fee}
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