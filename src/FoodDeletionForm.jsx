import React, { useState } from "react";
import axios from "axios";
import './Recetas.css';

export default function FoodDeletionForm() {
    const [category, setCategory] = useState("");
    const [foodName, setFoodName] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [deletionResult, setDeletionResult] = useState("");

    const handleSearch = () => {
        axios.get("https://iiiproyectodisenio-default-rtdb.firebaseio.com/Comidas.json")
        .then(response => {
            const comidas = Object.entries(response.data).map(([id, comida]) => ({ id, ...comida }));
            const comida = comidas.find(item => item.category === category && item.nombreComida === foodName);
            if (comida) {
                axios.delete(`https://iiiproyectodisenio-default-rtdb.firebaseio.com/Comidas/${comida.id}.json`)
                .then(() => {
                    setDeletionResult(`Comida "${foodName}" de categoría "${category}" eliminada exitosamente.`);
                })
                .catch(error => {
                    console.error("Error deleting food item:", error);
                    setDeletionResult(`Error al eliminar la comida: ${error.message}`);
                });
            } else {
                setDeletionResult(`No se encontró ninguna comida con el nombre "${foodName}" en la categoría "${category}".`);
            }
        })
        .catch(error => {
            console.error("Error searching for food item:", error);
            setDeletionResult(`Error al buscar la comida: ${error.message}`);
        });
    };
    
    return (
        <div>
            <button className= "text-center font-semibold text-2xl py-3" onClick={() => setShowForm(true)}>Delete Meals</button>
            {showForm && (
                <div>
                    <div className="space-y-10">
                        <label  htmlFor="category">Categoría:</label>
                        <input className="input-fieldDelete" id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <div className="space-y-10">
                        <label  htmlFor="foodName">Nombre de la Comida:</label>
                        <input className="input-fieldDelete" id="foodName" type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
                    </div>
                    <button className="mt-10 items-center bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded" onClick={handleSearch}>Buscar y Eliminar</button>
                    {deletionResult && <p>{deletionResult}</p>}
                </div>
            )}
        </div>
    );
}
