import React from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Product Detail Page
      </h1>
      <p className="text-gray-600 mb-4">
        Product ID: {id}
      </p>

      <Link
        to="/"
        className="inline-block bg-[#CCFF00] px-6 py-3 rounded-full font-bold"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ProductDetail;
