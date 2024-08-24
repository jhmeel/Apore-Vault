import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Fab,
  Popper,
  ClickAwayListener,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Grid,
  Button,
  SwipeableDrawer,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ExploreIcon from "@mui/icons-material/Explore";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useNavigate } from "react-router-dom";

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  maxWidth: "600px",
  margin: "0 auto",
  position: "relative",
}));

const StyledBottomNavigationAction = styled(BottomNavigationAction)(
  ({ theme }) => ({
    color: theme.palette.text.secondary,
    "&.Mui-selected": {
      color: theme.palette.primary.main,
    },
  })
);

const CenterButton = styled(Fab)(({ theme }) => ({
  position: "absolute",
  top: "-28px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.grey[900],
  },
}));


const NavBar: React.FC = () => {
  const [value, setValue] = useState("home");
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleAction = (action: string) => {
    setDrawerOpen(false);
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex:'1000' }}
        elevation={3}
      >
        <StyledBottomNavigation value={value} onChange={handleChange}>
          <StyledBottomNavigationAction
            label="Home"
            value="home"
            icon={<HomeIcon />}
            onClick={() => handleNavigate("/")}
          />
          <StyledBottomNavigationAction
            label="Transactions"
            value="transactions history"
            icon={<ReceiptLongIcon />}
            onClick={() => handleNavigate("/txhistory")}
          />
          <StyledBottomNavigationAction
            label="Portfolio"
            value="portfolio"
            icon={<AccountBalanceWalletIcon />}
            onClick={() => handleNavigate("/portfolio")}
          />
          <StyledBottomNavigationAction
            label="Explore"
            value="explore"
            icon={<ExploreIcon />}
            onClick={() => handleNavigate("/explore")}
          />

          <CenterButton onClick={() => setDrawerOpen(true)}>
            <SwapHorizIcon />
          </CenterButton>
        </StyledBottomNavigation>

        <SwipeableDrawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" gutterBottom >
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleAction("transfer")}
                >
                  Deposit
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleAction("transfer")}
                >
                  Transfer
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleAction("convert")}
                >
                  Convert
                </Button>
              </Grid>
            </Grid>
          </Box>
        </SwipeableDrawer>
      </Paper>
    </ClickAwayListener>
  );
};

export default NavBar;
