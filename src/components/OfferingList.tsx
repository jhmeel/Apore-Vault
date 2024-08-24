import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Rating,
  Divider,
  IconButton,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ILiquidityProvider, Ioffering } from "../types";

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
  boxShadow:"none",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const offerings: ILiquidityProvider[] = [
  {
    name: "Aquafinance Capita",
    did: "",
    rating: 4.5,
    offerings: [
      {
        id: "1",
        description: "Exchange your Kenyan Shilling for US Dollars",
        exchangeRate: "1 KES = 0.0085 USD",
        settlementTime: 4560,
        fee: 0.7,
        payin: {
          currencyCode: "GHS",
        },
        payout: {
          currencyCode: "KES",
        },
        requiredClaims: {},
      },
      {
        id: "2",
        description: "Exchange your Nigerian Naira for Kenyan Shilling",
        exchangeRate: "1 NGN = 0.0027 KES",
        settlementTime: 3455,
        fee: 0.7,
        payin: {
          currencyCode: "NGN",
        },
        payout: {
          currencyCode: "KES",
        },
        requiredClaims: {},
      },
    ],
  },
  {
    name: "Flowback Financial",
    did: "",
    rating: 3.4,
    offerings: [
      {
        id: "1",
        description: "Exchange your Ghana sedes for US Dollars",
        exchangeRate: "1 GHS = 0.18 USD",
        settlementTime: 0,
        fee: 0.5,
        payin: {
          currencyCode: "GHS",
        },
        payout: {
          currencyCode: "USD",
        },
        requiredClaims: {},
      },
    ],
  },
];

interface OfferingsListProps {
  onOfferingSelect: (offering: any) => void;
}

const OfferingsList: React.FC<OfferingsListProps> = ({ onOfferingSelect }) => {
  const formatSettlementTime = (time: number) => {
    if (time < 60) {
      return `${time} minutes`;
    } else {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      return `${hours} hours, ${minutes} minutes`;
    }
  };

  const formatOfferingDescription = (offering: Ioffering) => {
    return (
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Typography variant="body1">{offering.payin?.currencyCode}</Typography>
        </Grid>
        <Grid item>
          <SwapHorizIcon />
        </Grid>
        <Grid item>
          <Typography variant="body1">{offering?.payout?.currencyCode}</Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container spacing={4}>
      {offerings.map((provider) => (
        <Grid item xs={12} sm={6} key={provider.did}>
          <StyledCard>
            <CardContent>
              <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                <Grid item>
                  <Typography variant="h5" gutterBottom>
                    {provider.name}
                  </Typography>
                  <Rating name="read-only" value={provider.rating} readOnly precision={0.1} />
                </Grid>
              </Grid>
              <Grid container direction="column" spacing={2}>
                {provider.offerings.map((offering) => (
                  <Grid item key={offering.id}>
                    <StyledOfferingCard
                      onClick={() => onOfferingSelect(offering)}
                      style={{ cursor: "pointer" }}
                    >
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          {formatOfferingDescription(offering)}
                        </Grid>
                        <Grid item>
                          <IconButton>
                            <ArrowForwardIosIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                      <Grid container alignItems="center" justifyContent="space-between" mt={2}>
                        <Grid item>
                          <Typography variant="body2" color="textSecondary">
                            Exchange Rate: {offering.exchangeRate}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body2" color="textSecondary">
                            Settlement Time: {formatSettlementTime(offering.settlementTime)}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body2" color="textSecondary">
                            Fee: {offering.fee * 100}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </StyledOfferingCard>
                    {offering.id !== provider.offerings[provider.offerings.length - 1].id && (
                      <Grid container justifyContent="center" style={{ marginTop: "16px" }}>
                        <Divider style={{ width: "100%" }} />
                      </Grid>
                    )}
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default OfferingsList;