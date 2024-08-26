import React, { useState } from 'react';
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
  styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import newsImg from '../../assets/news.jpeg';
import newss from '../../assets/newss.jpeg'
import { IBlogPost } from '../../types';



const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    height:'50px'
  },
}));

const mockBlogPosts: IBlogPost[] = [
  {
    id: 1,
    title: "Understanding Bitcoin: A Beginner's Guide",
    excerpt: "Learn the basics of Bitcoin and how it's revolutionizing the financial world.",
    imageUrl: `${newsImg}`,
    author: "Jameel muhammed",
    date: "2023-05-01"
  },
  {
    id: 2,
    title: "The Rise of DeFi: Decentralized Finance Explained",
    excerpt: "Explore the world of DeFi and its potential to disrupt traditional financial systems.",
    imageUrl: `${newss}`,
    author: "Adebola Clement",
    date: "2024-05-08"
  },
  {
    id: 3,
    title: "NFTs: The Future of Digital Ownership",
    excerpt: "Discover how Non-Fungible Tokens are changing the way we think about digital assets.",
    imageUrl: `${newsImg}`,
    author: "ziongate",
    date: "2022-05-10"
  },
  {
    id: 4,
    title: "Tbdex: The Future of Financial exchange",
    excerpt: "Discover how to convert with different currency with out liquidity provided.",
    imageUrl: `${newss}`,
    author: "opeyemi james",
    date: "2023-04-10"
  },
  // Add more mock blog posts as needed
];

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = mockBlogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
       <Typography variant="h2" gutterBottom fontFamily="'Poppins', sans-serif">
        Explore Crypto Blog
      </Typography>
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
      <Grid container spacing={4}>
        {filteredPosts.map((post) => (
          <Grid item key={post.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={post.imageUrl}
                alt={post.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.excerpt}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  By {post.author} on {post.date}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Read More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blog;