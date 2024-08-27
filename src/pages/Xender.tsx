import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Ioffering, ILiquidityProvider } from "../types";
import { useUserActions } from "../actions";
import { formatSettlementTime } from "../utils";

const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    height: "50px",
  },
}));

const OfferingListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  maxWidth: "90vw",
  width: "600px",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    width: "100%",
  },
}));
const Xender: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffering, setSelectedOffering] = useState<Ioffering | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const { getLiquidityProviders } = useUserActions();
  const [providers, setProviders] = useState<ILiquidityProvider[] | null>(null);

  const [payoutAmount, setPayoutAmount] = useState("");
  useEffect(() => {
    if (sendAmount) {
      const payoutValue =
        parseFloat(sendAmount) *
        parseFloat(selectedOffering?.data.payoutUnitsPerPayinUnit);
      setPayoutAmount(payoutValue.toFixed(2));
    } else {
      setPayoutAmount("");
    }
  }, [sendAmount, selectedOffering?.data.payoutUnitsPerPayinUnit]);
  useEffect(() => {
    const fetchProviders = async () => {
      const result = await getLiquidityProviders();
      setProviders(result);
    };

    fetchProviders();
  }, [getLiquidityProviders]);

  useEffect(() => {
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
    setRecipientAddress("");
    setSendAmount("");
  };

  const handleSendConfirm = () => {
    // Implement send confirmation logic here
    console.log(
      "Sending",
      sendAmount,
      selectedOffering?.data.payin?.currencyCode,
      "to",
      recipientAddress
    );
    handleModalClose();
  };

  const filteredOfferings = providers?.flatMap((provider) =>
    provider.offerings?.filter((offering) =>
      offering.data.payin?.currencyCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  return (
    <PageContainer maxWidth="md" style={{ paddingBottom: "65px" }}>
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
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <List disablePadding>
          {filteredOfferings?.map((offering: Ioffering, index) => (
            <OfferingListItem
              key={offering.metadata.id}
              button
              onClick={() => handleOfferingClick(offering)}
              sx={{
                backgroundColor:
                  index % 2 === 0
                    ? theme.palette.background.default
                    : theme.palette.background.paper,
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {offering.data.payin?.currencyCode} <ArrowRightAltIcon />{" "}
                    {offering.data.payout?.currencyCode}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {offering.data.description
                        ?.replace(/Exchange/g, "Send")
                        .replace(/for/g, "to")}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <Chip
                        icon={
                          <StarIcon
                            sx={{ color: theme.palette.warning.main }}
                          />
                        }
                        label={providers
                          ?.filter((p) =>
                            p.offerings?.some(
                              (off) => off.signature == offering.signature
                            )
                          )[0]
                          .rating?.toFixed(1)}
                        size="small"
                        sx={{
                          mr: 1,
                          backgroundColor: theme.palette.warning.light,
                        }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {
                          providers?.filter((p) =>
                            p.offerings?.some(
                              (off) => off.signature == offering.signature
                            )
                          )[0].name
                        }
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              {!isMobile && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="send"
                    onClick={() => handleOfferingClick(offering)}
                  >
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
          <Typography
            variant="h5"
            id="send-transaction-modal-title"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Send {selectedOffering?.data.payin?.currencyCode}
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
            label={`Amount in ${selectedOffering?.data.payin?.currencyCode}`}
            variant="outlined"
            fullWidth
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {selectedOffering?.data.payin?.currencyCode}
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label={`Receiving Amount in ${selectedOffering?.data.payout?.currencyCode}`}
            variant="outlined"
            fullWidth
            value={payoutAmount}
            disabled
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {selectedOffering?.data.payout?.currencyCode}
                </InputAdornment>
              ),
            }}
          />

          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Fee:{" "}
              {selectedOffering?.data.payoutUnitsPerPayinUnit
                ? (
                    Number(selectedOffering?.data.payoutUnitsPerPayinUnit) * 100
                  ).toFixed(2)
                : 0}
              %
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Settlement Time:{" "}
              {formatSettlementTime(
                selectedOffering?.data.payout.methods[0].estimatedSettlementTime
              )}
            </Typography>
          </Box>
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleModalClose}
            >
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
