import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Menu from "./Menu";
import Orders from "./Orders";
import OrderDetail from "./OrderDetail";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}



function Services() {
  return <h2>Services Page</h2>;
}

function Contact() {
  return <h2>Contact Page</h2>;
}

export default App;
