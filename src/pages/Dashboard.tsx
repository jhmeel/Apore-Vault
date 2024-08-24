import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import {
  Box,
  Card,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  useTheme,
  styled,
  IconButton,
  SwipeableDrawer,
  Tab,
  Tabs,
  CircularProgress,
  TextField,
  InputAdornment,
  Badge,
  Drawer,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RefreshIcon from "@mui/icons-material/Update";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
  borderRadius: 16,
  padding: theme.spacing(2),
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
}));

const ActionButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 20,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  padding: theme.spacing(1),
  "& button": {
    flex: 1,
    height: "4rem",
    borderRadius: 0,
    borderRight: `1px solid ${theme.palette.divider}`,
    "&:last-child": {
      borderRight: "none",
    },
    "& .MuiButton-startIcon": {
      display: "block",
      marginBottom: theme.spacing(1),
    },
    textTransform: "none",
  },
}));

const AssetItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    height: "50px",
  },
}));

const ProgressWrapper = styled(Box)({
  position: "relative",
  height: 4,
  width: "100%",
  backgroundColor: "rgba(0,0,0,0.1)",
  borderRadius: 2,
  overflow: "hidden",
});

const ProgressBar = styled(Box)<{ width: number; color: string }>(
  ({ width, color }) => ({
    position: "absolute",
    height: "100%",
    width: `${width}%`,
    backgroundColor: color,
    transition: "width 0.5s ease-out",
  })
);

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  "& .MuiTab-root": {
    textTransform: "none",
    minWidth: 100,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const WalletButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  borderRadius: 20,
  padding: theme.spacing(1, 2),
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const WalletDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "50%",
  },
}));

const WalletList = styled(List)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const WalletListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(2),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const chartData = [
  { name: "Jan", value: 10000 },
  { name: "Feb", value: 12000 },
  { name: "Mar", value: 11000 },
  { name: "Apr", value: 13000 },
  { name: "May", value: 12500 },
  { name: "Jun", value: 12761.65 },
];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [walletDrawerOpen, setWalletDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
  const [address, setAddress] = useState<string>("");
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<string>("0");
  const [ethBalance, setEthBalance] = useState<string>("0");

  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "fd20f6567f094ba5b0e8a0ae6d8cbb9c",
        },
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: "Crimpy",
          infuraId: "fd20f6567f094ba5b0e8a0ae6d8cbb9c",
        },
      },
    };

    const newWeb3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions,
    });

    setWeb3Modal(newWeb3Modal);
  }, []);

  const disconnectWallet = async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
      setProvider(null);
      setAddress("");
      setUsdtBalance("0");
      setEthBalance("0");
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const refreshBalance = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const renderBalance = () => {
    const balance = "1,276.45";
    if (isBalanceHidden) {
      return "*".repeat(balance.length);
    }
    return `$${balance}`;
  };

  const cryptoAssets = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: 26159.0,
      change: 1.383,
      color: "#F7931A",
      allocation: 48.3,
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: 1659.08,
      change: 2.4,
      color: "#627EEA",
      allocation: 30.1,
    },
    {
      name: "Litecoin",
      symbol: "LTC",
      price: 65.91,
      change: -1.25,
      color: "#BFBBBB",
      allocation: 21.6,
    },
  ];

  const fiatAssets = [
    {
      name: "US Dollar",
      symbol: "USD",
      price: 1.0,
      change: 0.0,
      color: "#85bb65",
      allocation: 60.0,
    },
    {
      name: "Euro",
      symbol: "EUR",
      price: 1.18,
      change: 0.5,
      color: "#0052b4",
      allocation: 40.0,
    },
  ];

  const filteredAssets =
    tabValue === 0
      ? cryptoAssets.filter((asset) =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : fiatAssets.filter((asset) =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const openWalletDrawer = () => {
    setWalletDrawerOpen(true);
  };

  const closeWalletDrawer = () => {
    setWalletDrawerOpen(false);
  };

  const connectSpecificWallet = async (walletType: string) => {
    if (!web3Modal) {
      console.error("Web3Modal not initialized.");
      return;
    }

    try {
      let instance;
      switch (walletType) {
        case "MetaMask":
          instance = await web3Modal.connectTo("injected");
          break;
        case "WalletConnect":
          instance = await web3Modal.connectTo("walletconnect");
          break;
        case "Coinbase Wallet":
          instance = await web3Modal.connectTo("coinbasewallet");
          break;
        case "Trust Wallet":
          instance = await web3Modal.connectTo("walletconnect");
          break;
        case "OKX Wallet":
          instance = await web3Modal.connectTo("walletconnect");
          break;
        case "Binance Chain Wallet":
          instance = await web3Modal.connectTo("binancechainwallet");
          break;
          break;
        default:
          instance = await web3Modal.connect();
      }

      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setAddress(address);

      const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
      const usdtAbi = ["function balanceOf(address) view returns (uint256)"];
      const usdtContract = new ethers.Contract(
        usdtContractAddress,
        usdtAbi,
        provider
      );
      const usdtBalance = await usdtContract.balanceOf(address);
      setUsdtBalance(ethers.utils.formatUnits(usdtBalance, 6));

      const ethBalance = await provider.getBalance(address);
      setEthBalance(ethers.utils.formatEther(ethBalance));

      closeWalletDrawer();
    } catch (error) {
      toast.error("Failed to connect wallet");
      console.error("Failed to connect wallet:", error);
    }
  };

  const wallets = [
    { name: "MetaMask", icon: "🦊" },
    { name: "WalletConnect", icon: "🔗" },
    { name: "Coinbase Wallet", icon: "💰" },
    { name: "Trust Wallet", icon: "🔐" },
    { name: "OKX Wallet", icon: "🚀" },
    { name: "Binance Chain Wallet", icon: "🏦" },
  ];

  return (
    <Box
      sx={{
        maxWidth: "md",
        margin: "auto",
        padding: 1,
        paddingBottom: "4rem",
        position: "relative",
        zIndex: "10",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Crimpy 👋</Typography>
        <Box display="flex" alignItems="center">
          {!address ? (
            <WalletButton
              startIcon={<AccountBalanceWalletIcon />}
              onClick={openWalletDrawer}
              style={{ fontSize: 10 }}
              sx={{ mr: 2 }}
            >
              Connect Wallet
            </WalletButton>
          ) : (
            <WalletButton
              startIcon={<AccountBalanceWalletIcon />}
              onClick={disconnectWallet}
              style={{ fontSize: 10 }}
              sx={{ mr: 2 }}
            >
              Disconnect Wallet
            </WalletButton>
          )}
          <IconButton onClick={() => setDrawerOpen(true)}>
            <Badge badgeContent={notificationsCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      </Box>

      <StyledCard sx={{ mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Portfolio Balance
            </Typography>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {renderBalance()}
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton onClick={toggleBalanceVisibility} size="small">
                {isBalanceHidden ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                onClick={refreshBalance}
                size="small"
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <CircularProgress size={18} />
                ) : (
                  <RefreshIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
          </Box>
          {address && (
            <Box textAlign="right">
              <Typography variant="subtitle2">
                USDT Balance: ${usdtBalance}
              </Typography>
              <Typography variant="subtitle2">
                ETH Balance: {ethBalance} ETH
              </Typography>
              <Typography variant="caption">Address: {address}</Typography>
            </Box>
          )}
        </Box>

        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <RechartsTooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <ActionButtonContainer mt={2}>
          <Button startIcon={<SendIcon />} onClick={() => navigate("/xender")}>
            Send
          </Button>
          <Button
            startIcon={<CallReceivedIcon />}
            onClick={() => navigate("/receiver")}
          >
            Receive
          </Button>
          <Button
            startIcon={<SwapHorizIcon />}
            onClick={() => navigate("/converter")}
          >
            Convert
          </Button>
        </ActionButtonContainer>
      </StyledCard>

      <Box display="flex" alignItems="center" mb={2}>
        <SearchBar
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search assets"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 20,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        />
      </Box>
      <StyledTabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
      >
        <Tab label="Crypto" />
        <Tab label="Fiat" />
      </StyledTabs>

      <StyledCard>
        <List disablePadding>
          {filteredAssets.map((asset) => (
            <AssetItem key={asset.symbol}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: asset.color }}>{asset.symbol[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={asset.name}
                secondary={`Price: $${asset.price.toFixed(2)}`}
              />
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <Typography
                  variant="body2"
                  color={asset.change >= 0 ? "success.main" : "error.main"}
                >
                  {asset.change.toFixed(2)}%
                </Typography>
                <ProgressWrapper>
                  <ProgressBar
                    width={asset.allocation}
                    color={
                      asset.change >= 0
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                  />
                </ProgressWrapper>
              </Box>
            </AssetItem>
          ))}
        </List>
      </StyledCard>

      <SwipeableDrawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        sx={{ height: "auto" }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <TrendingUpIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Bitcoin Price Surge"
                secondary="Bitcoin has increased by 2.5% in the last 24 hours."
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <TrendingUpIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Ethereum Wallet Update"
                secondary="Ethereum wallet received 0.5 ETH."
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <TrendingUpIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Litecoin Price Drop"
                secondary="Litecoin price dropped by 1.2%."
              />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>

      <WalletDrawer
        anchor="bottom"
        open={walletDrawerOpen}
        onClose={closeWalletDrawer}
      >
        <Box sx={{ padding: theme.spacing(2) }}>
          <Typography variant="body1" gutterBottom>
            Connect Your Wallet
          </Typography>
          <WalletList>
            {wallets.map((wallet) => (
              <WalletListItem
                key={wallet.name}
                button
                onClick={() => connectSpecificWallet(wallet.name)}
              >
                <ListItemAvatar>
                  <Avatar>{wallet.icon}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={wallet.name} />
              </WalletListItem>
            ))}
          </WalletList>
        </Box>
      </WalletDrawer>
    </Box>
  );
};

export default Dashboard;
