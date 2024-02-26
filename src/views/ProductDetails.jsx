import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { formatCurrency } from "../helpers/formatCurrency";
import axios from "axios";
import { discountPrice } from "../helpers/discountPrice";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const ProductDetails = () => {
  const { id } = useParams();
  console.log(id);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    setLoading(false);
    try {
      const res = await axios.get(`${BASE_URL}/product/${id}`);
      const data = res.data;
      setProduct(data);
    } catch (error) {
      console.log("error");
      alert(`Ha ocurrido un error \n ${error}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <section className="container mt-5 vh-50">
        {loading ? (
          <div className="w-100 text-center">
            <Spinner />{" "}
          </div>
        ) : (
          ""
        )}
        <div className="row">
          <div className="col-4">
            <img src={product?.image} className="img-fluid" alt="" />
          </div>
          <div className="col-8">
            <h1>{product?.name}</h1>
            <h3 style={{ textDecoration: "line-through" }}>
              {product?.discountPercentage
                ? formatCurrency(product?.price)
                : ""}
              {product?.discountPercentage ? (
                <span className="badge bg-danger ms-2">
                  -${product.discountPercentage}%
                </span>
              ) : (
                "  "
              )}
            </h3>
            <h4>
              {formatCurrency(
                discountPrice(product?.price, product?.discountPercentage)
              )}
            </h4>
          </div>
        </div>
      </section>
    </>
  );
};
