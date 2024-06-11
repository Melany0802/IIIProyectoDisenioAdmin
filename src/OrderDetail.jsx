import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function OrderDetail() {
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

  
  const changeSate = (id,comida) => {
    axios.put(`https://iiiproyectodisenio-default-rtdb.firebaseio.com/Pedidos/${id}.json`, {
      estado: "Preparando",
      comida: comida,
    })
    .then(() => {
      console.log("Estado cambiado exitosamente");
    })
    .catch(error => {
      console.error("Error cambiando el estado de la orden:", error);
    });
  };
  
  return (
    <div className="orders-container">
      <h1>Detalles</h1>
      <ul className="orders-list">
        {pedidos.map(pedido => (
          <li key={pedido.id} className="order-item">
            <p><strong>Pedido:</strong> {pedido.comida}</p>
            <p><strong>Estado:</strong> {pedido.estado}</p>
            <p><strong>Ingredientes:</strong></p>
            <ul>
              {pedido.ingredientes.map((ingrediente, index) => (
                <li key={index}>{ingrediente.ingrediente}</li>
              ))}
            </ul>
            <p><strong>Instrucciones:</strong></p>
            <ul>
              {Object.entries(pedido.instrucciones).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
            <p><strong>Precio:</strong> {pedido.precio}</p>
            <p><strong>Restricción Dietética:</strong> {pedido.restriccionDietetica}</p>
            <p><strong>Instrucción Extra:</strong> {pedido.instruccionExtra}</p>
            <Link to={`/orders`}>
                <button className="custom-button" onClick={() => changeSate(pedido.id,pedido.comida)}>Aceptar</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default OrderDetail;