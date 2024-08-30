import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
// import ExploreProduct from "../../components/ExploreProduct/ExploreProduct";
import ProductDisplay from "../../ProductDisplay/ProductDisplay";
const Home = () => {
  
  return (
    <div>
      <Header />
      <ProductDisplay/>
    </div>
  );
};

export default Home;
