import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  Box,
  AppBar,
  Toolbar,
  useScrollTrigger,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated, config } from "react-spring";
import Typewriter from "typewriter-effect";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import bannerMockup from "../assets/apore-banner.png";
import logoImage from "../assets/logo.png";
import ExploreIcon from "@mui/icons-material/Explore";
import SecurityIcon from "@mui/icons-material/Security";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const GlassmorphicBox = styled(animated(Box))(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(4),
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #00BFFF 30%, #7B68EE 90%)",
  border: 0,
  borderRadius: 50,
  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
  color: "white",
  padding: "10px 20px",
  fontWeight: "bold",
  marginTop: theme.spacing(1),
  textTransform: "none",
  fontFamily: "'Poppins', sans-serif",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    background: "linear-gradient(45deg, #7B68EE 30%, #00BFFF 90%)",
    transform: "scale(1.05)",
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(15, 0),
}));

const features = [
  {
    title: "Secure Storage",
    description: "State-of-the-art encryption for your digital assets",
    icon: <SecurityIcon fontSize="large" />,
  },
  {
    title: "Multi-Currency Support",
    description: "Store and manage various cryptocurrencies",
    icon: <AccountBalanceWalletIcon fontSize="large" />,
  },
  {
    title: "Seamless Transfers",
    description: "Quick and easy transactions between wallets",
    icon: <SwapHorizIcon fontSize="large" />,
  },
  {
    title: "Integrated Exchange",
    description: "Swap currencies without leaving the app",
    icon: <ExploreIcon fontSize="large" />,
  },
];

const whyChooseUs = [
  {
    title: "Built on TBDEX Protocol",
    description:
      "Leveraging the power of decentralized exchanges for maximum security and efficiency.",
  },
  {
    title: "Seamless Fiat and Crypto Integration",
    description:
      "Easily manage both your traditional and cryptocurrency assets in one place.",
  },
  {
    title: "User-Friendly Interface",
    description:
      "Intuitive design that makes cryptocurrency management accessible to everyone.",
  },
  {
    title: "Advanced Security Features",
    description:
      "Multi-factor authentication, biometric login, and cold storage options to keep your assets safe.",
  },
  {
    title: "24/7 Customer Support",
    description:
      "Our dedicated team is always available to assist you with any questions or concerns.",
  },
  {
    title: "Regular Updates and Improvements",
    description:
      "We continuously enhance our platform based on user feedback and technological advancements.",
  },
];

const Landing = () => {
  const [animatedItem, setAnimatedItem] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const fadeProps = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(50px)" },
    reset: true,
    reverse: animatedItem % 2 === 0,
    delay: 200,
    config: config.molasses,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedItem((i) => (i + 1) % features.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleFeaturesExplore = () => {
    window.scrollBy(0, 600);
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "#0B0B1A",
        color: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />

      <AppBar
        position="fixed"
        color="transparent"
        elevation={trigger ? 4 : 0}
        sx={{
          backgroundColor: trigger ? "rgba(11, 11, 26, 0.8)" : "transparent",
          transition: "background-color 0.3s ease",
        }}
      >
        <Toolbar>
          <img
            src={logoImage}
            alt="Apore Vault Logo"
            style={{ width: 50, marginRight: 16 }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontFamily: "'Montserrat', sans-serif",
              color: "#FFFFFF",
            }}
          >
            Apore
          </Typography>
          <StyledButton
            variant="contained"
            onClick={() =>
              user?.displayName
                ? navigate("/dashboard")
                : navigate("/auth/signup")
            }
          >
            {user?.displayName ? (
              <Box display="flex" alignItems="center">
                <AccountBalanceWalletIcon />
              </Box>
            ) : (
              "Get Started"
            )}
          </StyledButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Section>
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="space-around"
          >
            <Grid item xs={12} md={6}>
              <GlassmorphicBox>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  fontWeight="bold"
                  fontFamily="'Montserrat', sans-serif"
                  sx={{ color: "#00BFFF" }}
                >
                  Apore Vault
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  fontFamily="'Poppins', sans-serif"
                >
                  <Typewriter
                    options={{
                      strings: ["Secure", "Efficient", "User-Friendly"],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                  Wallet Solution
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  fontFamily="'Roboto', sans-serif"
                >
                  Experience the next generation of wallet management with Apore
                  Vault. Built on the TBDEX protocol, offering unparalleled
                  security and ease of use.
                </Typography>
                <StyledButton
                  variant="contained"
                  size="large"
                  onClick={() =>
                    user?.displayName
                      ? navigate("/dashboard")
                      : handleFeaturesExplore()
                  }
                >
                  {user?.displayName ? "View Wallet" : "Explore Features"}
                </StyledButton>
              </GlassmorphicBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={bannerMockup}
                alt="Apore Vault Dashboard"
                sx={{
                  width: "100%",
                  maxWidth: "600px",
                  height: "auto",
                  borderRadius: "10px",
                  position:'relative',
                  zIndex:'100',
                  boxShadow: "0 4px 0 0 rgba(33, 203, 243, 0.3)",
                }}
              />
            </Grid>
          </Grid>
        </Section>

        <Section>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
            fontFamily="'Montserrat', sans-serif"
            sx={{ color: "#00BFFF" }}
          >
            Key Features
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <animated.div style={index === animatedItem ? fadeProps : {}}>
                  <GlassmorphicBox sx={{ textAlign: "center" }}>
                    <IconButton
                      sx={{ color: "#00BFFF", fontSize: "3rem", mb: 2 }}
                    >
                      {feature.icon}
                    </IconButton>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      fontWeight="bold"
                      fontFamily="'Poppins', sans-serif"
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontFamily="'Roboto', sans-serif"
                    >
                      {feature.description}
                    </Typography>
                  </GlassmorphicBox>
                </animated.div>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
            fontFamily="'Montserrat', sans-serif"
            sx={{ color: "#00BFFF" }}
          >
            Why Choose Apore Vault?
          </Typography>
          <Grid container spacing={4}>
            {whyChooseUs.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <GlassmorphicBox>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    fontFamily="'Poppins', sans-serif"
                    sx={{ color: "#00BFFF" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    fontFamily="'Roboto', sans-serif"
                  >
                    {item.description}
                  </Typography>
                </GlassmorphicBox>
              </Grid>
            ))}
          </Grid>
        </Section>
      </Container>

      <Box
        component="footer"
        sx={{ bgcolor: "rgba(11, 11, 26, 0.8)", color: "white", py: 3, mt: 8 }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            align="center"
            fontFamily="'Roboto', sans-serif"
          >
            © 2024 Apore Vault. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
