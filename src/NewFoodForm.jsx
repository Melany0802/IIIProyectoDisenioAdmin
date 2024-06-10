import React, { useState } from "react";
import axios from "axios";
import './Recetas.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function NewFoodForm() {
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [foodName, setFoodName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState("");
    const [restriction, setRestriction] = useState("");
    const [prices, setPrices] = useState({});
    const [quantities, setQuantities] = useState({});

    const addIngredient = () => {
        setIngredients([...ingredients, { variants: [] }]);
    };

    const addVariant = (index) => {
        const newIngredients = [...ingredients];
        newIngredients[index].variants.push({ variant: "", price: "", amount: "" }); // Añadir precio y cantidad a cada variante
        setIngredients(newIngredients);
    };

    

    const handleIngredientChange = (ingredientIndex, variantIndex, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[ingredientIndex].variants[variantIndex][field] = value;
        setIngredients(newIngredients);

        // Actualizar precios y cantidades
        if (field === 'priceV') {
            // Construir la clave del precio para cada variante
            const priceKey = `precioV${variantIndex + 1}`;
            setPrices({ ...prices, [priceKey]: value });
        } else if (field === 'amount') {
            // Construir la clave de la cantidad para cada variante
            const amountKey = `cantidad${variantIndex + 1}`;
            setQuantities({ ...quantities, [amountKey]: value });
        }
    };

    

    const addInstruction= () => {
        setInstructions([...instructions, ""]);
    }; 

    const removeInstruction = (index) => {
        const newInstructions = [...instructions];
        newInstructions.splice(index, 1);
        setInstructions(newInstructions);
    };

    const createFoodItem = () => {
        // Verificar si todos los campos de texto están completos
        if (!foodName || !imageUrl || !category || !restriction || instructions.some(instruction => !instruction)) {
            // Mostrar un toast de error si algún campo está vacío
            toast.error("This didn't work.");
            return;
        }
    
        // Si todos los campos están completos, proceder con la creación del elemento de comida
        const formattedIngredients = ingredients.reduce((acc, curr, index) => {
            acc[`ingrediente${index + 1}`] = curr.variants.reduce((variantAcc, variant, variantIndex) => {
                variantAcc[`variante${variantIndex + 1}`] = variant.variant;
                variantAcc[`precioV${variantIndex + 1}`] = variant.price; // Añadir precio de la variante
                variantAcc[`cantidad${variantIndex + 1}`] = variant.amount; // Añadir cantidad de la variante
                return variantAcc;
            }, {});
            return acc;
        }, {});
    
        const formattedInstructions = Object.keys(instructions).reduce((acc, step, index) => {
            acc["instrucciones"] = { ...acc["instrucciones"], [`paso${index + 1}`]: instructions[step] };
            return acc;
        }, {});
        
    
        axios.post("https://iiiproyectodisenio-default-rtdb.firebaseio.com/Comidas.json", {
            nombreComida: foodName,
            image: imageUrl,
            category: category,
            restriccionDietetica: restriction,
            ...formattedIngredients,
            ...formattedInstructions,
            ...prices, // Agregar precios al objeto de datos
            ...quantities // Agregar cantidades al objeto de datos
        })
        .then(response => {
            console.log("Food item created successfully:", response.data);
            toast.success('Successfully toasted!');
            setShowForm(false); // Ocultar el formulario después de crear el elemento de comida
        })
        .catch(error => {
            console.error("Error creating food item:", error);
        });
    };
    
    

    return (
        <div className="w-full max-w-2xl">
            <div>
                <h1 className="font-semibold text-xl text-center"> Create New Food Item</h1>
            </div>
            <div className="space-y-6">
                <div className="space-y-2 space-x-5">
                    <label htmlFor="nameFood">Name</label>
                    <input className="input-field" id="nameFood" placeholder="Enter food name" onChange={(e) => setFoodName(e.target.value)} />
                </div>
                <div className="space-y-2 space-x-5">
                    <label htmlFor="category">Category</label>
                    <input className="input-field" id="category" placeholder="Enter category" onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div className="space-y-2 space-x-5">
                    <label htmlFor="restriction">Dietary Restriction</label>
                    <input className="input-field" id="restriction" placeholder="Enter dietary restriction" onChange={(e) => setRestriction(e.target.value)} />
                </div>
                <div className="space-y-2 space-x-5">
                    <label htmlFor="image">Image URL</label>
                    <input className="input-field" id="image" placeholder="Enter image URL" onChange={(e) => setImageUrl(e.target.value)} />
                </div>
                <div className="space-y-4">
                    <div className="space-y-5 flex items-center justify-between">
                        <h3 className="text-lg font-medium">Ingredients</h3>
                        <button className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded" onClick={addIngredient}>Add Ingredient</button>
                    </div>
                    {ingredients.map((ingredient, ingredientIndex) => (
                        <div key={ingredientIndex} className="space-y-4">
                            <h4 className="text-lg font-medium">Ingredient {ingredientIndex + 1}</h4>
                            {ingredient.variants.map((variant, variantIndex) => (
                                <div key={variantIndex} className="grid grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor={`variant-${ingredientIndex}-${variantIndex}`}>Variant</label>
                                        <input className="input-field" id={`variant-${ingredientIndex}-${variantIndex}`} placeholder={`Variant ${variantIndex + 1}`} onChange={(e) => handleIngredientChange(ingredientIndex, variantIndex, 'variant', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor={`priceV-${ingredientIndex}-${variantIndex}`}>Price</label>
                                        <input className="input-field" id={`priceV-${ingredientIndex}-${variantIndex}`} type="number" placeholder={`Price ${variantIndex + 1}`} onChange={(e) => handleIngredientChange(ingredientIndex, variantIndex, 'priceV', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor={`amount-${ingredientIndex}-${variantIndex}`}>Amount</label>
                                        <input className="input-field" id={`amount-${ingredientIndex}-${variantIndex}`} placeholder={`Amount ${variantIndex + 1}`} onChange={(e) => handleIngredientChange(ingredientIndex, variantIndex, 'amount', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                            <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-5 rounded" onClick={() => removeIngredient(ingredientIndex)}>Remove Ingredient</button>
                            <button className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded" onClick={() => addVariant(ingredientIndex)}>Add Variant</button>
                        </div>
                    ))}
                </div>
                <div className="space-y-5">
                    <div className="space-y-5 flex items-center justify-between">
                        <h3 className="text-lg font-medium">Instructions</h3>
                        <button className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded" onClick={addInstruction}>Add Instruction</button>
                    </div>
                    {instructions.map((instruction, index) => (
                        <div key={index} className="instruction-row">
                            <input
                                type="text"
                                placeholder={`Instruction ${index + 1}`}
                                value={instruction}
                                className="input-field"
                                onChange={(e) => {
                                    const newInstructions = [...instructions];
                                    newInstructions[index] = e.target.value;
                                    setInstructions(newInstructions);
                                }}
                            />
                            <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-5 rounded" onClick={() => removeInstruction(index)}>Remove</button>
                        </div>
                    ))}
                </div>
                <button className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded" onClick={createFoodItem}>Create Food Item</button>
            </div>
            <ToastContainer position="top-center" reverseOrder={false} />
        
        </div>
        
    );
}