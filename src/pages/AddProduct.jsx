import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";

const AddProduct = ({ toggle, setToggle, jwtToken, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: true,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      setError("Name, Price, and Category are required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}`,
        { ...form, price: Number(form.price) },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      setToggle(false);
      onSuccess();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!toggle) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: 2, width: 400 }}>
        <Typography variant="h5" mb={2}>
          Add Product
        </Typography>
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}
        <Stack spacing={2}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="home">Home & Garden</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.inStock}
                onChange={(e) =>
                  setForm({ ...form, inStock: e.target.checked })
                }
              />
            }
            label="In Stock"
          />
          <TextField
            label="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setToggle(false)}
              disabled={loading}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default AddProduct;
