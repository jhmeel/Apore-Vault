import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import OfferingsList from "../components/OfferingList";
import ExchangeTxModal from "../components/ExchangeTxModal";
import { Ioffering } from "../types";

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

const Converter: React.FC = () => {
  const [selectedOffering, setSelectedOffering] = useState<Ioffering | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOfferingSelect = (offering: Ioffering) => {
    setSelectedOffering(offering);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <PageContainer maxWidth="md">
      <Typography variant="h2" gutterBottom fontFamily="'Poppins', sans-serif">
        Exchange
      </Typography>
      <SearchBar
        fullWidth
        placeholder="Search offerings..."
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box mb={10}>
        <OfferingsList
          onOfferingSelect={handleOfferingSelect}
          searchTerm={searchTerm}
        />
      </Box>
      <ExchangeTxModal
        open={isModalOpen}
        offering={selectedOffering}
        onClose={handleModalClose}
      />
    </PageContainer>
  );
};

export default Converter;
