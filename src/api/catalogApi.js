import api from "@/api/axios";

export const catalogApi = {
  getProducts() {
    return api.get("/catalog/products");
  },

  getProduct(productId) {
    return api.get(`/catalog/products/${productId}`);
  },
};