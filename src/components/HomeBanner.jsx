import React from "react";
import Logo from "../assets/logo.png";

export const HomeBanner = () => {
  return (
    <section className="container-fluid mt-5 text-center d-flex justify-content-center align-items-center">
      <img src={Logo} className="img-fluid" alt="" />
      <h1 className="display-2 fw-normal ms-5">Rolling Store</h1>
    </section>
  );
};
