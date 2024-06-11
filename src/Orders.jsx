import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './Orders.css';

function Orders() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    axios.get("https://iiiproyectodisenio-default-rtdb.firebaseio.com/Pedidos.json")
      .then(response => {
        const pedidos = Object.entries(response.data).map(([id, pedido]) => ({ id, ...pedido }));
        setPedidos(pedidos);
        console.log(pedidos);
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  return (
    <div className="orders-container">
      <h1>Órdenes</h1>
      <ul className="orders-list">
        {pedidos.map(pedido => (
          <li key={pedido.id} className="order-item">
            <p><strong>Pedido:</strong> {pedido['comida']}</p>
            <p><strong>Estado:</strong> {pedido['estado']}</p>
            <Link to={`/order/${pedido.id}`}>
              <button className="custom-button">
                Detalles
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
