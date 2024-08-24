import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Modal,
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Ioffering } from '../types';
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  maxWidth: '90vw',
  width: '600px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    width: '100%',
  },
}));

interface MainTxModalProps {
  open: boolean;
  offering: Ioffering | null;
  onClose: () => void;
  onConfirm: () => void;
}

const MainTxModal: React.FC<MainTxModalProps> = ({
  open,
  offering,
  onClose,
  onConfirm,
}) => {
  if (!offering) return null;

  const formatSettlementTime = (time: number) => {
    if (time < 60) {
      return `${time} minutes`;
    } else {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      return `${hours} hours, ${minutes} minutes`;
    }
  };

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      aria-labelledby="transaction-modal-title"
      aria-describedby="transaction-modal-description"
    >
      <ModalContent>
        <Box mb={1}>
          
        <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Typography variant="body1">{offering.payin?.currencyCode}</Typography>
        </Grid>
        <Grid item>
          <SwapHorizIcon />
        </Grid>
        <Grid item>
          <Typography variant="body1">{offering?.payout?.currencyCode}</Typography>
        </Grid>
      </Grid>
      <Typography variant="body1" id="transaction-modal-description">
            {offering.description}
          </Typography>
        </Box>
        <Divider />
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label={`Amount in ${offering.payin?.currencyCode}`}
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{offering.payin?.currencyCode}</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={`Amount in ${offering.payout?.currencyCode}`}
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{offering.payout?.currencyCode}</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  Exchange Rate: {offering.exchangeRate}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  Settlement Time: {formatSettlementTime(offering.settlementTime)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  Fee: {offering.fee * 100}%
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm} sx={{ ml: 2 }}>
            Confirm
          </Button>
        </Box>
      </ModalContent>
    </StyledModal>
  );
};

export default MainTxModal;