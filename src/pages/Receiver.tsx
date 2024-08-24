import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Drawer,
  IconButton,
  Button,
  Chip,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloseIcon from '@mui/icons-material/Close';
import QRCode from 'qrcode.react';
import toast from 'react-hot-toast';

const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    height: '50px',
  },
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

const QRCodeContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const AddressTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
}));

const CurrencyChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));
const currencies = [
  { code: 'BTC', name: 'Bitcoin', isCrypto: true, address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', icon: '₿' },
  { code: 'ETH', name: 'Ethereum', isCrypto: true, address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', icon: 'Ξ' },
  { code: 'USD', name: 'US Dollar', isCrypto: false, address: 'N/A', icon: '$' },
  { code: 'EUR', name: 'Euro', isCrypto: false, address: 'N/A', icon: '€' },
  { code: 'GBP', name: 'British Pound', isCrypto: false, address: 'N/A', icon: '£' },
  { code: 'JPY', name: 'Japanese Yen', isCrypto: false, address: 'N/A', icon: '¥' },
  { code: 'AUD', name: 'Australian Dollar', isCrypto: false, address: 'N/A', icon: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', isCrypto: false, address: 'N/A', icon: 'C$' },
];


const Receiver = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCurrencyClick = (currency) => {
    setSelectedCurrency(currency);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleCopyAddress = () => {
    if (selectedCurrency && selectedCurrency.address !== 'N/A') {
      navigator.clipboard.writeText(selectedCurrency.address)
        .then(() => {
          toast.success('Address copied to clipboard');
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
          toast.error('Failed to copy address');
        });
    } else {
      toast.error('No valid address to copy');
    }
  };

  const filteredCurrencies = currencies.filter((currency) =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer maxWidth="md">
     <Typography variant="h2" gutterBottom>
        Receive Funds
      </Typography>
      <SearchBar
        fullWidth
        placeholder="Search currencies..."
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Select a currency to receive:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {filteredCurrencies.map((currency) => (
            <CurrencyChip
              key={currency.code}
              icon={currency.isCrypto ? <AccountBalanceWalletIcon /> : <AccountBalanceIcon />}
              label={`${currency.name} (${currency.code})`}
              onClick={() => handleCurrencyClick(currency)}
              color="primary"
              variant="outlined"
              clickable
            />
          ))}
        </Box>
      </Paper>
      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { 
            height: 'auto', 
            maxHeight: '80%', 
            borderTopLeftRadius: 16, 
            borderTopRightRadius: 16,
          },
        }}
      >
        <DrawerContent>
          {selectedCurrency && (
            <Fade in={isDrawerOpen}>
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <IconButton
                  onClick={handleDrawerClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h5" gutterBottom>
                  Receive {selectedCurrency.name}
                </Typography>
                {selectedCurrency.isCrypto ? (
                  <>
                    <QRCodeContainer>
                      <QRCode value={selectedCurrency.address} size={200} />
                    </QRCodeContainer>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Scan the QR code or use the address below to receive {selectedCurrency.name}.
                    </Typography>
                    <AddressTextField
                      fullWidth
                      variant="outlined"
                      value={selectedCurrency.address}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleCopyAddress} edge="end">
                              <ContentCopyIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopyAddress}
                      fullWidth
                    >
                      Copy Address
                    </Button>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Make sure to double-check the address before sending any funds.
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    To receive {selectedCurrency.name}, please contact your bank or financial institution for the appropriate account details.
                  </Typography>
                )}
              </Box>
            </Fade>
          )}
        </DrawerContent>
      </Drawer>
    </PageContainer>
  );
};

export default Receiver;