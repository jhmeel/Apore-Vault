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
  styled,
  Dialog,
  DialogContent,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    height: "50px",
  },
}));

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(
          "https://cryptopanic.com/api/v1/posts/?auth_token=1243ae69f3bd4c7e66cb7355d9cf47e648fe6d5f&public=true"
        );
        setBlogPosts(response.data.results);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  const handleOpenPost = (url: string) => {
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
              <Skeleton variant="rectangular" width="100%" height={200} />
              <Skeleton width="60%" />
              <Skeleton width="80%" />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={4}>
          {blogPosts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    post.thumbnail
                      ? post.thumbnail
                      : "https://via.placeholder.com/300"
                  }
                  alt={post.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.domain}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Published on{" "}
                    {new Date(post.published_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenPost(post.url)}>
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <iframe
            src={iframeUrl}
            title="Blog Post"
            width="100%"
            height="600px"
            style={{ border: "none" }}
          />
        </DialogContent>
      </Dialog>

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
