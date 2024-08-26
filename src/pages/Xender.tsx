import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Modal,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import { Ioffering, ILiquidityProvider } from '../types';

const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
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

const OfferingListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

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
const Xender: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [offerings, setOfferings] = useState<ILiquidityProvider[]>([]);
  const [selectedOffering, setSelectedOffering] = useState<Ioffering | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');

  useEffect(() => {
    // Mock data for offerings and liquidity providers
    const mockOfferings: ILiquidityProvider[] = [
      {
        name: 'Provider A',
        did: 'did:example:123',
        rating: 4.5,
        offerings: [
          {
            id: '1',
            description: 'Send USD',
            exchangeRate: '1 USD = 1 USD',
            settlementTime: 30,
            fee: 0.01,
            payin: { currencyCode: 'USD' },
            payout: { currencyCode: 'USD' },
          },
          {
            id: '2',
            description: 'Send EUR',
            exchangeRate: '1 EUR = 1.2 USD',
            settlementTime: 30,
            fee: 0.015,
            payin: { currencyCode: 'EUR' },
            payout: { currencyCode: 'USD' },
          },
        ],
      },
      // Add more mock liquidity providers here
    ];

    setOfferings(mockOfferings);

    // Check if there's an offering in the location state
    if (location.state && location.state.offering) {
      setSelectedOffering(location.state.offering);
      setIsModalOpen(true);
    }
  }, [location]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOfferingClick = (offering: Ioffering) => {
    setSelectedOffering(offering);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRecipientAddress('');
    setSendAmount('');
  };

  const handleSendConfirm = () => {
    // Implement send confirmation logic here
    console.log('Sending', sendAmount, selectedOffering?.payin?.currencyCode, 'to', recipientAddress);
    handleModalClose();
  };

  const filteredOfferings = offerings.flatMap(provider =>
    provider.offerings.filter(offering =>
      offering.payin?.currencyCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <PageContainer maxWidth="md">
     <Typography variant="h2" gutterBottom fontFamily="'Poppins', sans-serif">
        Send Funds
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
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <List disablePadding>
          {filteredOfferings.map((offering, index) => (
            <OfferingListItem
              key={offering.id}
              button
              onClick={() => handleOfferingClick(offering)}
              sx={{
                backgroundColor: index % 2 === 0 ? theme.palette.background.default : theme.palette.background.paper,
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {offering.payin?.currencyCode}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {offering.description}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <Chip
                        icon={<StarIcon sx={{ color: theme.palette.warning.main }} />}
                        label={offerings[0].rating.toFixed(1)}
                        size="small"
                        sx={{ mr: 1, backgroundColor: theme.palette.warning.light }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {offerings[0].name}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              {!isMobile && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="send" onClick={() => handleOfferingClick(offering)}>
                    <SendIcon color="primary" />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </OfferingListItem>
          ))}
        </List>
      </Paper>
      <StyledModal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="send-transaction-modal-title"
      >
        <ModalContent>
          <Typography variant="h5" id="send-transaction-modal-title" gutterBottom sx={{ fontWeight: 'bold' }}>
            Send {selectedOffering?.payin?.currencyCode}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <TextField
            label="Recipient Address/Account Number"
            variant="outlined"
            fullWidth
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label={`Amount in ${selectedOffering?.payin?.currencyCode}`}
            variant="outlined"
            fullWidth
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{selectedOffering?.payin?.currencyCode}</InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Fee: {selectedOffering?.fee ? (selectedOffering.fee * 100).toFixed(2) : 0}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Settlement Time: {selectedOffering?.settlementTime} minutes
            </Typography>
          </Box>
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button variant="outlined" color="primary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendConfirm}
              sx={{ ml: 2 }}
              disabled={!recipientAddress || !sendAmount}
            >
              Send
            </Button>
          </Box>
        </ModalContent>
      </StyledModal>
    </PageContainer>
  );
};

export default Xender;