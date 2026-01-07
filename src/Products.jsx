import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const [jwtToken, setJwtToken] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/");
      return;
    }
    setJwtToken(token);
  }, [navigate]);

  useEffect(() => {
    if (!jwtToken) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/products`, {
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
        localStorage.removeItem("jwt_token");
        navigate("/");
      });
  }, [jwtToken, navigate]);

  const clearToken = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Typography variant="h4">Products</Typography>
        <Button color="error" variant="contained" onClick={clearToken}>
          Logout
        </Button>
      </Box>

      <Grid container spacing={3} mt={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              {product.imageUrl && (
                <CardMedia
                  component="img"
                  height="180"
                  image={product.imageUrl}
                  alt={product.name}
                />
              )}
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">{product.description}</Typography>
                <Typography mt={1}>💲{product.price}</Typography>
                <Typography>Category: {product.category}</Typography>
                <Typography color={product.inStock ? "green" : "red"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
