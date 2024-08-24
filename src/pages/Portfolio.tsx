import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import SecurityIcon from "@mui/icons-material/Security";
import HelpIcon from "@mui/icons-material/Help";
import SupportIcon from "@mui/icons-material/Support";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

interface Holding {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
}

interface PortfolioSummary {
  totalCryptoValue: number;
  totalFiatValue: number;
}

const mockCryptoHoldings: Holding[] = [
  { id: "1", name: "Bitcoin", symbol: "BTC", amount: 0.5, value: 20000 },
  { id: "2", name: "Ethereum", symbol: "ETH", amount: 5, value: 10000 },
  { id: "3", name: "Cardano", symbol: "ADA", amount: 1000, value: 500 },
  { id: "4", name: "Polkadot", symbol: "DOT", amount: 100, value: 2000 },
];

const mockFiatHoldings: Holding[] = [
  { id: "5", name: "US Dollar", symbol: "USD", amount: 5000, value: 5000 },
  { id: "6", name: "Euro", symbol: "EUR", amount: 1000, value: 1200 },
];

const Portfolio: React.FC = () => {
  const theme = useTheme();
  const [cryptoHoldings, setCryptoHoldings] = useState<Holding[]>([]);
  const [fiatHoldings, setFiatHoldings] = useState<Holding[]>([]);
  const [filteredCryptoHoldings, setFilteredCryptoHoldings] = useState<
    Holding[]
  >([]);
  const [filteredFiatHoldings, setFilteredFiatHoldings] = useState<Holding[]>(
    []
  );
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideCryptoBalance, setHideCryptoBalance] = useState(false);
  const [hideFiatBalance, setHideFiatBalance] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate()

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
  }));

  const ActionButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
  }));

  const HoverableListItem = styled(ListItem)(({ theme }) => ({
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      cursor: "pointer",
    },
  }));

  const SearchBar = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
      borderRadius: 20,
      height: "50px",
    },
  }));

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCryptoHoldings(mockCryptoHoldings);
      setFiatHoldings(mockFiatHoldings);
      setFilteredCryptoHoldings(mockCryptoHoldings);
      setFilteredFiatHoldings(mockFiatHoldings);
      setSummary({
        totalCryptoValue: mockCryptoHoldings.reduce(
          (acc, holding) => acc + holding.value,
          0
        ),
        totalFiatValue: mockFiatHoldings.reduce(
          (acc, holding) => acc + holding.value,
          0
        ),
      });
      setLoading(false);
    }, 1000);

    // Generate a random username
    const adjectives = ["Happy", "Clever", "Brave", "Curious", "Friendly"];
    const nouns = ["Panda", "Tiger", "Dolphin", "Eagle", "Penguin"];
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    setUsername(`${randomAdjective}${randomNoun}`);
  }, []);

  useEffect(() => {
    setFilteredCryptoHoldings(
      cryptoHoldings.filter(
        (holding) =>
          holding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          holding.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredFiatHoldings(
      fiatHoldings.filter(
        (holding) =>
          holding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          holding.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, cryptoHoldings, fiatHoldings]);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const formatBalance = (value: number, type: "C" | "F") => {
    return type == "F"
      ? hideFiatBalance
        ? "*".repeat(8)
        : value.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : hideCryptoBalance
      ? "*".repeat(8)
      : value.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="md" margin={"auto"} marginBottom={10}>
      <Box
        display="flex"
        p={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h2" gutterBottom>Your Portfolio</Typography>
        <IconButton onClick={toggleDrawer(true)} size="large">
          <SettingsIcon />
        </IconButton>
      </Box>

      {summary && (
        <Grid container p={2} spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Crypto Value
                </Typography>
                <Typography variant="body1">
                  {formatBalance(summary.totalCryptoValue, 'C')}
                  <IconButton
                    size="small"
                    onClick={() => setHideCryptoBalance(!hideCryptoBalance)}
                  >
                    {hideCryptoBalance ? <VisibilityOffIcon fontSize="10"/> : <VisibilityIcon fontSize="10"/>}
                  </IconButton>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Fiat Value
                </Typography>
                <Typography variant="body1">
                  {formatBalance(summary.totalFiatValue,'F')}
                  <IconButton
                    size="small"
                    onClick={() => setHideFiatBalance(!hideFiatBalance)}
                  >
                    {hideFiatBalance ? <VisibilityOffIcon fontSize="10" /> : <VisibilityIcon fontSize="10"/>}
                  </IconButton>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Box display="flex" justifyContent="center" mb={2}>
        <ActionButton
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          onClick={() => navigate('/xender')}
        >
          Send
        </ActionButton>
        <ActionButton
          variant="contained"
          color="secondary"
          startIcon={<CallReceivedIcon />}
          onClick={() => navigate('/receiver')}
        >
          Receive
        </ActionButton>
        <ActionButton
          variant="contained"
          color="info"
          startIcon={<SwapHorizIcon />}
          onClick={() => navigate('/converter')}
        >
          Convert
        </ActionButton>
      </Box>

      <Box pl={3} pr={3}>
        <SearchBar
          fullWidth
          variant="outlined"
          placeholder="Search holdings..."
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

      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
        <Tab label="Crypto" />
        <Tab label="Fiat" />
      </Tabs>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Asset</StyledTableCell>
                <StyledTableCell align="right">Holdings</StyledTableCell>
                <StyledTableCell align="right">Value</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCryptoHoldings.map((holding) => (
                <TableRow key={holding.id}>
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1">{holding.name}</Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        {holding.symbol}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{holding.amount}</TableCell>
                  <TableCell align="right">
                    {formatBalance(holding.value,'C')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Asset</StyledTableCell>
                <StyledTableCell align="right">Holdings</StyledTableCell>
                <StyledTableCell align="right">Value</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFiatHoldings.map((holding) => (
                <TableRow key={holding.id}>
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1">{holding.name}</Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        {holding.symbol}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{holding.amount}</TableCell>
                  <TableCell align="right">
                    {formatBalance(holding.value,'F')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 2 }}>{username[0]}</Avatar>
            <Typography variant="subtitle1">{username}</Typography>
          </Box>
          <List>
            <HoverableListItem>
              <ListItemIcon>
                <NotificationsOffIcon />
              </ListItemIcon>
              <ListItemText primary="Disable Notifications" />
              <Switch edge="end" />
            </HoverableListItem>
            <HoverableListItem>
              <ListItemIcon>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
              <ListItemText primary="Dark Mode" />
              <Switch
                edge="end"
                onChange={() => setDarkMode(!darkMode)}
                checked={darkMode}
              />
            </HoverableListItem>
            <HoverableListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Configure 2FA" />
            </HoverableListItem>
            <HoverableListItem>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="FAQ" />
            </HoverableListItem>
            <HoverableListItem>
              <ListItemIcon>
                <SupportIcon />
              </ListItemIcon>
              <ListItemText primary="Support" />
            </HoverableListItem>
            <HoverableListItem>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </HoverableListItem>
          </List>
          <Box sx={{ position: "absolute", bottom: 10, left: 10 }}>
            <Typography variant="caption" color="textSecondary">
              Version 1.0.0
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Portfolio;
