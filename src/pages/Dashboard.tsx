import React, { useState, useEffect, useCallback } from "react";
import Web3Modal from "web3modal";
import { ethers, BrowserProvider, formatUnits, formatEther } from "ethers";
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
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
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
import { useAuth } from "../context/AuthContext";
import { IHolding, INotification } from "../types";
import { useWallet } from "../context/UserContext";

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

const AssetItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const SearchBar = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    height: "50px",
  },
}));

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

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
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
  const [notificationsCount, setNotificationsCount] = useState(1);
  const navigate = useNavigate();
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
  const [address, setAddress] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<string>("0");
  const [ethBalance, setEthBalance] = useState<string>("0");
  const { state } = useWallet();
  const { userDetails } = useAuth();
  const [filteredCryptoAssets, setFilteredCryptoAssets] = useState<IHolding[]>(
    []
  );
  const [filteredFiatAssets, setFilteredFiatAssets] = useState<IHolding[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const initWeb3Modal = useCallback(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "fd20f6567f094ba5b0e8a0ae6d8cbb9c",
          qrcodeModalOption: {
            mobileLinks: [
              "rainbow",
              "metamask",
              "argent",
              "trust",
              "imtoken",
              "pillar",
            ],
            desktopLinks: ["encrypted ink", "metamask", "coinbase"],
          },
        },
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: "Apore",
          infuraId: "fd20f6567f094ba5b0e8a0ae6d8cbb9c",
        },
      },
    };

    const newWeb3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions,
      theme: "dark",
    });

    setWeb3Modal(newWeb3Modal);
  }, []);

  useEffect(() => {
    initWeb3Modal();
  }, [initWeb3Modal]);

  useEffect(() => {
    const bc = new BroadcastChannel("EVENTS");

    const handleNotification = (event: MessageEvent) => {
      if (event.data?.type && event.data?.message) {
        setNotifications((prev) => {
          const newNotifications = [...prev];
          if (
            !newNotifications.some((not) => not.id === event.data.message.id)
          ) {
            newNotifications.push(event.data.message);
          }
          return newNotifications;
        });
      }
    };

    bc.addEventListener("message", handleNotification);

    return () => {
      bc.removeEventListener("message", handleNotification);
      bc.close();
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) {
      setNotificationsCount(notifications.length);
    }
  }, [notifications, drawerOpen]);

  useEffect(() => {
    if (userDetails?.holdings) {
      const cryptoAssets = userDetails.holdings?.filter(
        (asset) => asset.type === "Crypto"
      );
      const fiatAssets = userDetails.holdings?.filter(
        (asset) => asset.type === "Fiat"
      );

      setFilteredCryptoAssets(
        cryptoAssets.filter((asset) =>
          asset?.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      setFilteredFiatAssets(
        fiatAssets.filter((asset) =>
          asset?.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [userDetails?.holdings, searchQuery]);

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

  const connectWallet = async () => {
    if (!web3Modal) {
      console.error("Web3Modal not initialized.");
      return;
    }

    try {
      const instance = await web3Modal.connect();
      const provider = new BrowserProvider(instance);
      const signer = provider.getSigner();
      const address = await (await signer).getAddress();

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
      setUsdtBalance(formatUnits(usdtBalance, 6));

      const ethBalance = await provider.getBalance(address);
      setEthBalance(formatEther(ethBalance));
    } catch (error) {
      toast.error("Failed to connect wallet");
      console.error("Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connectWallet();
    }
  }, [web3Modal]);

  return (
    <Box
      sx={{
        maxWidth: "md",
        margin: "auto",
        padding: 1,
        paddingBottom: "4rem",
        position: "relative",
    
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontFamily="'Poppins', sans-serif">
          {userDetails?.fullName.split(" ")[0]} 👋
        </Typography>
        <Box display="flex" alignItems="center">
          {!address ? (
            <WalletButton
              startIcon={<AccountBalanceWalletIcon />}
              onClick={connectWallet}
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
            {state.notificationsEnabled ? (
              <Badge badgeContent={notificationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            ) : (
              <NotificationsOffIcon />
            )}
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

        <Box display="flex" justifyContent="center" mb={2}>
          <ActionButton
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={() => navigate("/xender")}
          >
            Send
          </ActionButton>
          <ActionButton
            variant="contained"
            color="secondary"
            startIcon={<CallReceivedIcon />}
            onClick={() => navigate("/receiver")}
          >
            Receive
          </ActionButton>
          <ActionButton
            variant="contained"
            color="info"
            startIcon={<SwapHorizIcon />}
            onClick={() => navigate("/converter")}
          >
            Convert
          </ActionButton>
        </Box>
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
          {tabValue === 0
            ? filteredCryptoAssets.map((asset) => (
                <AssetItem key={asset.id}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {asset.symbol?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={asset.name}
                    secondary={`${asset.amount} ${asset.symbol}`}
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                  >
                    <Typography variant="body2">
                      ${asset.value?.toFixed(2)}
                    </Typography>
                  </Box>
                </AssetItem>
              ))
            : filteredFiatAssets.map((asset) => (
                <AssetItem key={asset.id}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                      }}
                    >
                      {asset.symbol?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={asset.name}
                    secondary={`${asset.symbol}`}
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                  >
                    <Typography variant="body2">
                      ${asset.value?.toFixed(2)}
                    </Typography>
                  </Box>
                </AssetItem>
              ))}
        </List>
      </StyledCard>

      {state.notificationsEnabled && (
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
            <List style={{ maxHeight: "300px", overflowY: "auto" }}>
              {notifications.length > 0 ? (
                notifications.map((notification: INotification, i) => (
                  <ListItem key={i}>
                    <ListItemAvatar>
                      {notification?.icon && (
                        <Avatar>{notification?.icon}</Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={notification.content}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" align="center">
                  No notifications yet ☹
                </Typography>
              )}
            </List>
          </Box>
        </SwipeableDrawer>
      )}
    </Box>
  );
};

export default Dashboard;
