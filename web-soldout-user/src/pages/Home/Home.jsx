import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreProduct from "../../components/ExploreProduct/ExploreProduct";
import ProductDisplay from "../../ProductDisplay/ProductDisplay";

const Home = () => {
  const [categories, setCategories] = useState("all");

  return (
    <div>
      <Header />
      <ExploreProduct categories={categories} setCategories={setCategories} />
      <ProductDisplay categories={categories}/>
    </div>
  );
};

export default Home;
