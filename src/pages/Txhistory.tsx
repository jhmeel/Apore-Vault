import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { styled, useTheme } from "@mui/material/styles";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import { ITransaction } from "../types";
import { useAuth } from "../context/AuthContext";
import { useUserActions } from "../actions";
import logoImg from "../assets/logo.png";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  cursor: "pointer",
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  backgroundColor:
    status === "completed"
      ? theme.palette.success.main
      : status === "pending"
      ? theme.palette.warning.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
  fontSize: 10,
  fontWeight: "bold",
}));

const DetailItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 14,
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    height: "50px",
  },
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Logo = styled("img")({
  width: "100px",
  height: "auto",
  marginBottom: "20px",
});

const Txhistory: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    ITransaction[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTx, setSelectedTx] = useState<ITransaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { getTxHistory } = useUserActions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.uid) {
        setLoading(true);
        const txHistory = await getTxHistory(user.uid);
        setTransactions(txHistory);
        setFilteredTransactions(txHistory);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    const filtered = transactions?.filter(
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
      JsBarcode(barcodeRef.current, selectedTx?.reference, {
        format: "CODE128",
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

  const downloadAsImage = async (
    elementRef: React.RefObject<HTMLElement>,
    fileName: string
  ) => {
    if (elementRef.current) {
      const canvas = await html2canvas(elementRef.current);
      const logo = new Image();
      logo.src = logoImg;
      await new Promise((resolve) => {
        logo.onload = resolve;
      });

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Add logo
        const logoWidth = 100;
        const logoHeight = (logo.height / logo.width) * logoWidth;
        ctx.drawImage(
          logo,
          (canvas.width - logoWidth) / 2,
          20,
          logoWidth,
          logoHeight
        );

        ctx.font = "12px Arial";
        ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
        ctx.textAlign = "center";
        ctx.fillText("Apore Vault", canvas.width / 2, canvas.height - 20);
      }

      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const renderTransactionList = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      );
    }

    if (!filteredTransactions?.length) {
      return (
        <Fade in={true} timeout={1000}>
          <Typography variant="body1" align="center">
            No Transactions found :(
          </Typography>
        </Fade>
      );
    }

    if (isMobile) {
      return (
        <Grid container spacing={2}>
          {filteredTransactions.map((tx) => (
            <Grid item xs={12} key={tx.reference}>
              <Fade in={true} timeout={500}>
                <Card>
                  <CardActionArea onClick={() => handleTxClick(tx)}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {tx.type}
                      </Typography>
                      <Typography variant="body1" color="primary" gutterBottom>
                        {tx.amount} {tx.currencyCode}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {tx.timestamp?.toDate().toLocaleString()}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={1}
                      >
                        <Typography variant="body2">{tx.narration}</Typography>
                        <StatusChip
                          label={tx.status}
                          status={tx.status}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Fade>
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
              <StyledTableCell>Narration</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <StyledTableRow
                key={tx.reference}
                onClick={() => handleTxClick(tx)}
              >
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>{tx.currencyCode}</TableCell>
                <TableCell>{tx.timestamp?.toDate().toLocaleString()}</TableCell>
                <TableCell>{tx.narration}</TableCell>
                <TableCell>
                  <StatusChip
                    label={tx.status}
                    status={tx.status}
                    size="small"
                  />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box
      sx={{
        maxWidth: "md",
        margin: "auto",
        padding: 2,
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
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 400,
            p: 3,
            overflowY: "auto",
          },
        }}
      >
        {selectedTx && (
          <Box ref={detailsRef}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h5">Transaction Details</Typography>
              <IconButton onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Logo src={logoImg} alt="Logo" />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DetailItem>
                  <DetailLabel variant="subtitle2">Type</DetailLabel>
                  <DetailValue variant="body1">{selectedTx.type}</DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12}>
                <DetailItem>
                  <DetailLabel variant="subtitle2">Amount</DetailLabel>
                  <DetailValue variant="body1">
                    {selectedTx.amount} {selectedTx.currencyCode}
                  </DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12}>
                <DetailItem>
                  <DetailLabel variant="subtitle2">Date</DetailLabel>
                  <DetailValue variant="body1">
                    {selectedTx.timestamp?.toDate().toLocaleString()}
                  </DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12}>
                <DetailItem>
                  <DetailLabel variant="subtitle2">Status</DetailLabel>
                  <StatusChip
                    label={selectedTx.status}
                    status={selectedTx.status}
                  />
                </DetailItem>
              </Grid>
              <Grid item xs={12}>
                <DetailItem>
                  <DetailLabel variant="subtitle2">From</DetailLabel>
                  <DetailValue variant="body1" className="hidden-scrollbar" style={{overflowX:'auto'}}>
                    {selectedTx.type == "CONVERT"
                      ? selectedTx.from
                      : user?.displayName}
                  </DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12}>
                <DetailItem>
                  <DetailLabel variant="subtitle2">To</DetailLabel>
                  <DetailValue variant="body1" className="hidden-scrollbar" style={{overflowX:'auto'}}>
                    {selectedTx.to || "N/A"}
                  </DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12}>
                <DetailItem>
                  <DetailLabel variant="subtitle2">Narration</DetailLabel>
                  <DetailValue variant="body1" className="hidden-scrollbar" style={{overflowX:'auto'}}>
                    {selectedTx.narration}
                  </DetailValue>
                </DetailItem>
              </Grid>
              <Grid item xs={12}>
                <Box textAlign="center" mb={2} className="hidden-scrollbar" style={{overflowX:'auto'}}>
                  <svg ref={barcodeRef}></svg>
                </Box>
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center">
              <DownloadButton
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() =>
                  downloadAsImage(detailsRef, "transaction_details.png")
                }
              >
                Download Receipt
              </DownloadButton>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default Txhistory;
