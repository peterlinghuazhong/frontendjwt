import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";

const Products = () => {
  const navigate = useNavigate();
  const [jwtToken, setJwtToken] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [addToggle, setAddToggle] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Fetch JWT token
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/"); // redirect to login if no token
      return;
    }
    setJwtToken(token);
  }, [navigate]);

  // Fetch products
  useEffect(() => {
    if (!jwtToken) return;
    fetchProducts();
  }, [jwtToken]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 403) clearToken();
    } finally {
      setLoading(false);
    }
  };

  const clearToken = () => {
    localStorage.removeItem("jwt_token");
    navigate("/");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
      alert("Failed to delete product");
    }
  };

  const openEdit = (product) => {
    setCurrentProduct(product);
    setEditToggle(true);
  };

  if (loading) return <Typography mt={5}>Loading...</Typography>;

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Products</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={clearToken}>
            Logout
          </Button>
          <Button variant="contained" onClick={() => setAddToggle(true)}>
            Add Product
          </Button>
        </Stack>
      </Box>

      {/* Products Grid */}
      <Box display="flex" flexWrap="wrap" gap={2}>
        {products.map((p) => (
          <Box
            key={p._id}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
            width={250}
          >
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.name} width="100%" height={140} />
            ) : (
              <Box
                height={140}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="#eee"
              >
                No Image
              </Box>
            )}
            <Typography variant="h6">{p.name}</Typography>
            <Typography>{p.description}</Typography>
            <Typography>${p.price}</Typography>
            <Typography>{p.category}</Typography>
            <Typography color={p.inStock ? "green" : "red"}>
              {p.inStock ? "In Stock" : "Out of Stock"}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Button variant="outlined" onClick={() => openEdit(p)}>
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </Button>
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Modals */}
      {addToggle && (
        <AddProduct
          toggle={addToggle}
          setToggle={setAddToggle}
          jwtToken={jwtToken}
          onSuccess={fetchProducts}
        />
      )}

      {editToggle && currentProduct && (
        <EditProduct
          toggle={editToggle}
          setToggle={setEditToggle}
          jwtToken={jwtToken}
          product={currentProduct}
          onSuccess={fetchProducts}
        />
      )}
    </Box>
  );
};

export default Products;
