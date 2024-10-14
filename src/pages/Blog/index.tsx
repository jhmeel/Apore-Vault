import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  SwipeableDrawer,
  Box,
  CircularProgress,
  Skeleton,
  useTheme,
  Chip,
  useMediaQuery,
  styled,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  NewReleases as NewReleasesIcon,
  BookmarkBorder as BookmarkIcon,
  Close as CloseIcon,
  ArrowForward,
} from '@mui/icons-material';

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    height: "50px",
  },
}));
const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9 aspect ratio
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const encodedUrl = encodeURIComponent('https://cryptopanic.com/api/v1/posts/?auth_token=1243ae69f3bd4c7e66cb7355d9cf47e648fe6d5f&public=true');
        const {data} = await axios.get(
          `https://api.allorigins.win/raw?url=${encodedUrl}`
        );
        console.log(data.results)
        setBlogPosts(data.results);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  const handleOpenPost = (url: string) => {
    console.log(url)
    setIframeUrl(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIframeUrl("");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
      <Typography variant="h2" gutterBottom fontFamily="'Poppins', sans-serif">
        Explore
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SearchBar
          fullWidth
          variant="outlined"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {loading || !blogPosts.length ? (
        <Grid container spacing={4}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" width="100%" height={80} />
              <Skeleton width="60%" />
              <Skeleton width="80%" />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={4}>
        {blogPosts
          .filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <StyledCard>
               
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.domain}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Published on {new Date(post.published_at).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {post.currencies?.map((currency) => (
                      <StyledChip key={currency.code} label={currency.code} variant="outlined" size="small" />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto' }}>
                  <Button size="small" onClick={() => handleOpenPost(`https://${post.domain}/${post.slug}`)}>
                    Read More <ArrowForward fontSize="24"/>
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
      </Grid>
    )}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        onOpen={() => {}}
        disableSwipeToOpen
      >
        <Box sx={{ position: 'relative', height: isMobile ? '100vh' : '80vh' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <iframe
            src={iframeUrl}
            title="Blog Post"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </Box>
      </SwipeableDrawer>

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </Container>
  );
};

export default Blog;
