import { styled } from '@mui/material/styles';
import { Paper, TextField, Button } from '@mui/material';

export const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 500,
  margin: '40px auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: '20px auto',
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const Logo = styled('img')({
  width: 150,
  marginBottom: 20,
});