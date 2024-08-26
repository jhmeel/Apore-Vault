import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Box,
  Chip,
  Drawer,
  IconButton,
  Grid,
  Button,
  useMediaQuery,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { styled, useTheme } from '@mui/material/styles';
import JsBarcode from 'jsbarcode';
import html2canvas from 'html2canvas';
import { ITransaction } from '../types';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  backgroundColor:
    status === 'completed'
      ? theme.palette.success.main
      : status === 'pending'
      ? theme.palette.warning.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
  fontSize:10,
}));

const DetailItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize:13,
}));
const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    height:'50px'
  },
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const mockTransactions: ITransaction[] = [
  {
    id: '1',
    from: '0x1234...5678',
    to: '0xabcd...efgh',
    type: 'SEND',
    amount: 0.5,
    currencyCode: 'BTC',
    timestamp: new Date('2024-08-22T10:30:00'),
    status: 'completed',
    description: 'Payment for services',
  },
  {
    id: '2',
    from: '0xabcd...efgh',
    to: '0x1234...5678',
    type: 'RECEIVE',
    amount: 100,
    currencyCode: 'USD',
    timestamp: new Date('2024-08-21T15:45:00'),
    status: 'completed',
    description: 'Refund',
  },
  {
    id: '3',
    from: '0x1234...5678',
    type: 'CONVERT',
    amount: 1000,
    currencyCode: 'EUR',
    timestamp: new Date('2024-08-20T09:15:00'),
    status: 'pending',
    description: 'EUR to USD conversion',
    liquidityProvider: {
      name: 'ExchangeX',
      did: 'did:example:123456',
      rating: 4.5,
      offerings: [],
    },
  },
  {
    id: '4',
    from: '0x9876...5432',
    to: '0x1234...5678',
    type: 'RECEIVE',
    amount: 2.5,
    currencyCode: 'ETH',
    timestamp: new Date('2024-08-19T18:00:00'),
    status: 'completed',
    description: 'Ethereum transfer',
  },
  {
    id: '5',
    from: '0x1234...5678',
    to: '0xfeda...bcba',
    type: 'SEND',
    amount: 500,
    currencyCode: 'USDT',
    timestamp: new Date('2024-08-18T11:30:00'),
    status: 'failed',
    description: 'Failed USDT transfer',
  },
  {
    id: '6',
    from: '0x1234...5678',
    type: 'CONVERT',
    amount: 1000,
    currencyCode: 'BTC',
    timestamp: new Date('2024-08-17T14:20:00'),
    status: 'completed',
    description: 'BTC to ETH conversion',
    liquidityProvider: {
      name: 'CryptoSwap',
      did: 'did:example:789012',
      rating: 4.8,
      offerings: [],
    },
  },
  {
    id: '7',
    from: '0xabcd...efgh',
    to: '0x1234...5678',
    type: 'RECEIVE',
    amount: 750,
    currencyCode: 'XRP',
    timestamp: new Date('2024-08-16T09:45:00'),
    status: 'completed',
    description: 'XRP deposit',
  },
  {
    id: '8',
    from: '0x1234...5678',
    to: '0x5678...1234',
    type: 'SEND',
    amount: 100,
    currencyCode: 'LTC',
    timestamp: new Date('2024-08-15T16:10:00'),
    status: 'pending',
    description: 'Litecoin transfer',
  },
  {
    id: '9',
    from: '0x1234...5678',
    type: 'CONVERT',
    amount: 5000,
    currencyCode: 'USD',
    timestamp: new Date('2024-08-14T13:00:00'),
    status: 'completed',
    description: 'USD to EUR conversion',
    liquidityProvider: {
      name: 'ForexPro',
      did: 'did:example:345678',
      rating: 4.2,
      offerings: [],
    },
  },
  {
    id: '10',
    from: '0xfedc...ba98',
    to: '0x1234...5678',
    type: 'RECEIVE',
    amount: 0.1,
    currencyCode: 'BTC',
    timestamp: new Date('2024-08-13T10:30:00'),
    status: 'completed',
    description: 'Bitcoin received',
  },
];

const Txhistory: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState<ITransaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Simulating API call to fetch transactions
    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = transactions.filter(
      (tx) =>
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.currencyCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.status?.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  useEffect(() => {
    if (selectedTx && barcodeRef.current) {
      JsBarcode(barcodeRef.current, selectedTx.id, {
        format: 'CODE128',
        width: 2,
        height: 50,
        displayValue: true,
      });
    }
  }, [selectedTx]);

  const handleTxClick = (tx: ITransaction) => {
    setSelectedTx(tx);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTx(null);
  };

  const downloadAsImage = (elementRef: React.RefObject<HTMLElement>, fileName: string) => {
    if (elementRef.current) {
      html2canvas(elementRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const renderTransactionList = () => {
    if (isMobile) {
      return (
        <Grid container spacing={2}>
          {filteredTransactions.map((tx) => (
            <Grid item xs={12} key={tx.id}>
              <Card>
                <CardActionArea onClick={() => handleTxClick(tx)}>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      {tx.type} | {tx.amount} {tx.currencyCode}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {tx.timestamp?.toLocaleString()}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Typography variant="body2">{tx.description}</Typography>
                      <StatusChip label={tx.status} status={tx.status} size="small" />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell>Currency</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id} onClick={() => handleTxClick(tx)} sx={{ cursor: 'pointer' }}>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>{tx.currencyCode}</TableCell>
                <TableCell>{tx.timestamp?.toLocaleString()}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>
                  <StatusChip label={tx.status} status={tx.status} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box
    sx={{
      maxWidth:'md',
      margin: "auto",
      padding: 1,
      paddingBottom: "4rem",
      position: "relative",
    }}
  >
        <Typography variant="h2" gutterBottom fontFamily="'Poppins', sans-serif">
        Transaction History
      </Typography>
      <Box>
      <SearchBar
        fullWidth
           placeholder="Search transactions..."
        variant="outlined"
      
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {renderTransactionList()}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 3,
            maxHeight: '80vh',
            overflowY: 'auto',
          },
        }}
      >
        {selectedTx && (
         <Box
         sx={{
           maxWidth: 600,
           margin: "auto",
           padding: 1,
         }}
       >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Transaction Details</Typography>
              <IconButton onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Grid container spacing={3} ref={detailsRef}>
              <Grid item xs={12} md={6}>
                <DetailItem>
                  <DetailLabel variant="subtitle2">Type</DetailLabel>
                  <DetailValue variant="body1">{selectedTx.type}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel variant="subtitle2">Amount</DetailLabel>
                  <DetailValue variant="body1">
                    {selectedTx.amount} {selectedTx.currencyCode}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel variant="subtitle2">Date</DetailLabel>
                  <DetailValue variant="body1">
                    {selectedTx.timestamp?.toLocaleString()}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel variant="subtitle2">Status</DetailLabel>
                  <StatusChip label={selectedTx.status} status={selectedTx.status} />
                </DetailItem>
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem>
                  <DetailLabel variant="subtitle2">From</DetailLabel>
                  <DetailValue variant="body1">{selectedTx.from}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel variant="subtitle2">To</DetailLabel>
                  <DetailValue variant="body1">{selectedTx.to || 'N/A'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel variant="subtitle2">Description</DetailLabel>
                  <DetailValue variant="body1">{selectedTx.description}</DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12}>
                <Box textAlign="center" mb={2}>
                  <svg ref={barcodeRef}></svg>
                </Box>
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center">
              <DownloadButton
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => downloadAsImage(detailsRef, 'transaction_details.png')}
              >
                Download Details
              </DownloadButton>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default Txhistory;