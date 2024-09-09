/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Rating,
  Divider,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ILiquidityProvider, Ioffering } from "../types";
import { useUserActions } from "../actions";
import { formatSettlementTime } from "../utils";
import toast from "react-hot-toast";

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const StyledOfferingCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  transition: "transform 0.2s",
  boxShadow: "none",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

interface OfferingsListProps {
  onOfferingSelect: (offering: any) => void;
}

const OfferingsList: React.FC<OfferingsListProps> = ({ onOfferingSelect }) => {
  const { getLiquidityProviders } = useUserActions();
  const [providers, setProviders] = useState<ILiquidityProvider[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const result = await getLiquidityProviders();
        setLoading(false);
        setProviders(result);
      } catch (error:any) {
        setLoading(false);
        toast.error("Error fetching providers:", error.message);
      }
    };

    fetchProviders();
  }, []);

  const formatOfferingDescription = (offering: Ioffering) => {
    return (
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Typography variant="body1">
            {offering.data.payin?.currencyCode}
          </Typography>
        </Grid>
        <Grid item>
          <SwapHorizIcon />
        </Grid>
        <Grid item>
          <Typography variant="body1">
            {offering.data.payout?.currencyCode}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container spacing={4}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "50px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : providers && providers.length > 0 ? (
        providers.map((provider: ILiquidityProvider) => (
          <Grid item xs={12} sm={6} key={provider.did}>
            <StyledCard>
              <CardContent>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Grid item>
                    <Typography variant="h5" gutterBottom>
                      {provider.name}
                    </Typography>
                    <Rating
                      name="read-only"
                      value={provider.rating}
                      readOnly
                      precision={0.1}
                    />
                  </Grid>
                </Grid>
                <Grid container direction="column" spacing={2}>
                  {provider?.offerings?.map((offering: Ioffering) => (
                    <Grid item key={offering.metadata.id}>
                      <StyledOfferingCard
                        onClick={() => onOfferingSelect(offering)}
                        style={{ cursor: "pointer" }}
                      >
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            {formatOfferingDescription(offering)}
                          </Grid>
                          <Grid item>
                            <IconButton>
                              <ArrowForwardIosIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                          mt={2}
                        >
                          <Grid item>
                            <Typography variant="body2" color="textSecondary">
                              Exchange Rate:{" "}
                              {offering.data.payoutUnitsPerPayinUnit}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body2" color="textSecondary">
                              Settlement Time:{" "}
                              {formatSettlementTime(
                                offering.data.payout.methods[0]
                                  ?.estimatedSettlementTime || 0
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </StyledOfferingCard>
                      {offering.metadata.id !==
                        provider?.offerings[provider.offerings.length - 1]
                          ?.metadata.id && (
                        <Grid
                          container
                          justifyContent="center"
                          style={{ marginTop: "16px" }}
                        >
                          <Divider style={{ width: "100%" }} />
                        </Grid>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>
        ))
      ) : (
        <Box sx={{ width: "100%", textAlign: "center", marginTop: "50px" }}>
          <Typography variant="body2" color="textSecondary">
            No providers available at this time :(
          </Typography>
        </Box>
      )}
    </Grid>
  );
};

export default OfferingsList;
