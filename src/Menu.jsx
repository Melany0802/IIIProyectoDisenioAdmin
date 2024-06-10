import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewFoodForm from './NewFoodForm';
import FoodDeletionForm from './FoodDeletionForm';
import './Recetas.css';

export default function Menu() {
    const [comidas, setComidas] = useState([]);
    const [selectedComida, setSelectedComida] = useState(null);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showDeletionForm, setShowDeletionForm] = useState(false);
    const [deletionFormValues, setDeletionFormValues] = useState({ category: "", foodName: "" });


    useEffect(() => {
        axios.get('https://iiiproyectodisenio-default-rtdb.firebaseio.com/Comidas.json')
            .then(response => {
                const fetchedComidas = [];
                for (const key in response.data) {
                    fetchedComidas.push({
                        id: key,
                        ...response.data[key]
                    });
                }
                setComidas(fetchedComidas);
            })
            .catch(error => console.error(error));
    }, []);

    const showDeletionFormHandler = () => {
        console.log("showDeletionFormHandler called");
        setShowDeletionForm(true);
        console.log("showDeletionForm:", showDeletionForm);
    };
    
    

    const hideDeletionFormHandler = () => {
        setShowDeletionForm(false);
    };

    const handleDeletionFormChange = (event) => {
        const { name, value } = event.target;
        setDeletionFormValues({ ...deletionFormValues, [name]: value });
    };

    const handleDeletionFormSubmit = async (event) => {
        event.preventDefault();
    
        try {
            // Extraer los valores de deletionFormValues
            const { category, foodName } = deletionFormValues;
    
            // Verificar si se proporcionaron tanto la categoría como el nombre de la comida
            if (!category || !foodName) {
                console.error("Debe ingresar una categoría y un nombre de comida para eliminar.");
                return;
            }
    
            // Realizar la solicitud de eliminación de comida a la API
            const response = await axios.delete(`https://iiiproyectodisenio-default-rtdb.firebaseio.com/Comidas.json`, {
                data: {
                    category,
                    foodName
                }
            });
    
            // Verificar si la solicitud se completó correctamente
            if (response.status === 200) {
                console.log(`Se eliminó correctamente la comida "${foodName}" de la categoría "${category}".`);
                // Actualizar el estado u otra lógica de manejo después de la eliminación
            } else {
                console.error("Ocurrió un error al intentar eliminar la comida.");
            }
        } catch (error) {
            console.error("Error al enviar la solicitud de eliminación:", error);
        }
    };
    

    const handleAddComida = (newComida) => {
        axios.post('https://iiiproyectodisenio-default-rtdb.firebaseio.com/Comidas.json', newComida)
            .then(response => {
                setComidas([...comidas, response.data]);
                setShowModal(false); // Aquí cerramos el modal después de agregar la comida
            })
            .catch(error => console.error(error));
    };

    const handleAgregarComida = () => {
        setShowModal(true); // Aquí establecemos showModal en true cuando se hace clic en el botón
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePress = (comida) => {
        setSelectedComida(comida);
    };

    const handleCheckboxToggle = (ingredienteKey, varianteKey) => {
        const newSelectedVariants = { ...selectedVariants };
        if (newSelectedVariants[ingredienteKey] === varianteKey) {
            delete newSelectedVariants[ingredienteKey];
        } else {
            newSelectedVariants[ingredienteKey] = varianteKey;
        }
        setSelectedVariants(newSelectedVariants);
    };

    const renderInstrucciones = () => {
        if (!selectedComida || (!selectedComida.instrucciones && !selectedComida.instruccionExtra && !selectedComida.restriccionDietetica)) return null;
        const instrucciones = Object.entries(selectedComida.instrucciones || {})
            .filter(([key, value]) => value.trim() !== '')
            .map(([key, value]) => ({
                paso: key,
                texto: value
            }));

        return (
            <div>
                <h2>Instrucciones de preparación</h2>
                {instrucciones.map((instr, index) => (
                    <p key={index}><strong>{instr.paso}: </strong>{instr.texto}</p>
                ))}
            </div>
        );
    };

    const categorizedComidas = comidas.reduce((acc, comida) => {
        const category = comida.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(comida);
        return acc;
    }, {});

    return (
        <div className="container">
            <div className='flex'>
                <button className="bg-blue-900 hover:bg-blue-700  m-2 flex-col items-center mx-96 text-white font-bold py-2 px-5 rounded" onClick={handleAgregarComida}>Agregar Comida</button>

                <button className="bg-blue-900 hover:bg-blue-700  m-2 flex-col items-center  text-white font-bold py-2 px-5 rounded" onClick={showDeletionFormHandler}>Eliminar Comida</button>

            </div>


            {showModal && (
                <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <NewFoodForm /> {/* Renderiza el formulario de nueva comida dentro del modal */}
                    </div>
                </div>
            )}
            {showDeletionForm && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <span className="close" onClick={hideDeletionFormHandler}>&times;</span>
                        <FoodDeletionForm
                            values={deletionFormValues}
                            onChange={handleDeletionFormChange}
                            onSubmit={handleDeletionFormSubmit}
                        />
                    </div>
                </div>
            )}


            {selectedComida ? (
                <div>
                    <button className="float-right bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setSelectedComida(null)}>Volver</button>

                    <div className="detailsContainer">
                        <h2>{selectedComida.nombreComida}</h2>
                        {selectedComida.image && (
                            <div className="imageContainer">
                                <img src={selectedComida.image} alt={selectedComida.nombreComida} className="image" />
                            </div>
                        )}
                        <div className="headerContainer">
                            <span className="headerText">Cantidad</span>
                            <span className="headerText">Ingredientes</span>
                            <span className="headerText">Precio</span>
                        </div>
                        <hr />
                        {Object.keys(selectedComida)
                            .filter(key => key.startsWith('ingrediente'))
                            .sort((a, b) => a.localeCompare(b))
                            .map((key, index) => {
                                const variantes = Object.keys(selectedComida[key])
                                    .filter(subKey => subKey.startsWith('variante'))
                                    .map((subKey, subIndex) => {
                                        const variante = selectedComida[key][subKey];
                                        const precioVariante = selectedComida[`precioV${subKey.slice(8)}`];
                                        if (variante && variante.trim() !== '') {
                                            const precio = precioVariante ? `$${precioVariante}` : '';
                                            return (
                                                <div key={subIndex} className="variantContainer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedVariants
                                                        [key] === subKey}
                                                        onChange={() => handleCheckboxToggle(key, subKey)}
                                                    />
                                                    <span>{variante}</span>
                                                    <span className="variantPrice">{precio}</span>
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }
                                    });

                                return variantes.length > 0 ? (
                                    <div key={index} className="ingredientContainer">
                                        <span className="ingredientText">{selectedComida['cantidad' + key.slice(11)]}</span>
                                        <div className="variantColumn">{variantes}</div>
                                    </div>
                                ) : null;
                            })}
                    </div>

                    <div className="detailsContainerInstructions">
                        {renderInstrucciones()}
                    </div>
                </div>
            ) : (
                <div>
                    {['Pastas', 'Arroces', 'Puré', 'Sopas', 'Ensaladas'].map(category => (
                        <div key={category}>
                            {categorizedComidas[category] && (
                                <div className="sectionContainer">
                                    <h2 className="categoryTitle" style={{ fontSize: '24px', fontFamily: 'bold' }}>{category}</h2>

                                    <div className="cardList">
                                        {categorizedComidas[category].map(item => (
                                            <div key={item.id} className="card" onClick={() => handlePress(item)}>
                                                <img src={item.image || '/placeholder.svg'} alt={item.nombreComida} className="cardImage" />
                                                <div className="cardContent">
                                                    <h3 className="cardTitle">{item.nombreComida}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
