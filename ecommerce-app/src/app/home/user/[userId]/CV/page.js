"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

export default function EditCV({ params }) {
    const { userId } = params;
    const [formData, setFormData] = useState({
        experiencia: [],
        certificaciones: [],
        educacion: [],
        idiomas: [],
        skills: []
    });
    const [loading, setLoading] = useState(true);
    const [previousPath, setPreviousPath] = useState('');
    const [hasData, setHasData] = useState(false);
    const router = useRouter();
    const [statusMessage, setStatusMessage] = useState('');  // Nuevo estado para el mensaje de éxito o error

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        // Verificar si hay datos existentes del CV
        const fetchCVData = async () => {
            try {
                const cvRes = await fetch(`/api/user/${userId}/Resume/getCV`, { method: 'GET', headers });
                const cvData = await cvRes.json();

                if (cvData?.data) {
                    // Aquí aplicamos el cambio sugerido para almacenar los IDs de cada sección
                    setFormData({
                        skills: cvData.data.habilidades || [],  // Habilidades ahora tendría los ids de cada habilidad
                        idiomas: cvData.data.idiomas || [],
                        experiencia: cvData.data.experiencias || [],
                        educacion: cvData.data.educaciones || [],
                        certificaciones: cvData.data.certificaciones || []
                    });

                    // Comprobamos si hay algún dato no vacío en cualquier campo
                    const hasNonEmptyData = [
                        cvData.data.habilidades,
                        cvData.data.idiomas,
                        cvData.data.experiencias,
                        cvData.data.educaciones,
                        cvData.data.certificaciones
                    ].some(field => field && field.length > 0);

                    setHasData(hasNonEmptyData);
                } else {
                    setHasData(false); // No hay datos guardados
                }
            } catch (error) {
                console.error('Error fetching CV data:', error);
                setHasData(false); // Considerar el CV como vacío en caso de error
            } finally {
                setLoading(false); // Finaliza la carga sin importar el resultado
            }
        };

        fetchCVData();
        setPreviousPath(document.referrer);
    }, [userId, router]);

    const handleChange = (e, section, index) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updatedSection = [...prev[section]];
            updatedSection[index] = { ...updatedSection[index], [name]: value };

            return {
                ...prev,
                [section]: updatedSection
            };
        });
    };

    const handleAddItem = (section) => {
        const newItem = {
            experiencia: { id: null, titulo_puesto: '', empresa: '', ubicacion: '', fecha_inicio: '', fecha_fin: '', descripcion: '' },
            certificaciones: { id: null, nombre: '', organizacionEmisora: '', fechaObtencion: '', descripcion: '' },
            educacion: { id: null, gradoObtenido: '', institucion: '', fechaInicio: '', fechaFin: '' },
            idiomas: { id: null, nombre: '', nivelDominio: '' },
            skills: { id: null, nombre: '', nivelDominio: '', descripcion: '' }
        };

        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem[section]]
        }));
    };


    const handleDeleteCert = async (section, index) => {
        const itemToDelete = formData[section][index];

        // Confirmar si el usuario realmente desea eliminar el ítem
        if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            return;
        }

        // Si el ítem aún no ha sido creado (id es null), solo elimínalo del frontend
        if (itemToDelete.id === null) {
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));
            return;
        }

        // Si el ítem tiene un id (ya ha sido creado), procede con la eliminación en la API
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        try {
            // Realiza la solicitud DELETE a la API
            const response = await fetch(`/api/user/${userId}/certificaciones/delete?id=${itemToDelete.id}`, {
                method: 'DELETE',
                headers
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar la certificación');
            }

            // Elimina la certificación del estado local
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));

            alert('Certificación eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar certificación:', error);
            alert('Error al eliminar la certificación.');
        }
    };


    const handleDeleteExperience = async (section, index) => {
        const itemToDelete = formData[section][index];

        // Confirmar si el usuario realmente desea eliminar el ítem
        if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            return;
        }

        // Si el ítem aún no ha sido creado (id es null), solo elimínalo del frontend
        if (itemToDelete.id === null) {
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));
            return;
        }

        // Si el ítem tiene un id (ya ha sido creado), procede con la eliminación en la API
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        try {
            // Realiza la solicitud DELETE a la API
            const response = await fetch(`/api/user/${userId}/experiencias/delete?id=${itemToDelete.id}`, {
                method: 'DELETE',
                headers
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al Experiencia la Education');
            }

            // Elimina la Experiencia del estado local
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));

            alert('Experiencia eliminada exitosamente');
        } catch (error) {
            console.error('Error al Experiencia Education:', error);
            alert('Error al Experiencia la Education.');
        }
    };

    const handleDeleteEducation = async (section, index) => {
        const itemToDelete = formData[section][index];

        // Confirmar si el usuario realmente desea eliminar el ítem
        if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            return;
        }

        // Si el ítem aún no ha sido creado (id es null), solo elimínalo del frontend
        if (itemToDelete.id === null) {
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));
            return;
        }

        // Si el ítem tiene un id (ya ha sido creado), procede con la eliminación en la API
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        try {
            // Realiza la solicitud DELETE a la API
            const response = await fetch(`/api/user/${userId}/educacion/delete?id=${itemToDelete.id}`, {
                method: 'DELETE',
                headers
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar la certificación');
            }

            // Elimina la Education del estado local
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));

            alert('Education eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar Education:', error);
            alert('Error al eliminar la Education.');
        }
    };

    const handleDeleteIdioma = async (section, index) => {
        const itemToDelete = formData[section][index];

        // Confirmar si el usuario realmente desea eliminar el ítem
        if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            return;
        }

        // Si el ítem aún no ha sido creado (id es null), solo elimínalo del frontend
        if (itemToDelete.id === null) {
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));
            return;
        }

        // Si el ítem tiene un id (ya ha sido creado), procede con la eliminación en la API
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        try {
            // Realiza la solicitud DELETE a la API
            const response = await fetch(`/api/user/${userId}/idiomas/delete?id=${itemToDelete.id}`, {
                method: 'DELETE',
                headers
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar la certificación');
            }

            // Elimina la Idioma del estado local
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));

            alert('Idioma eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar Idioma:', error);
            alert('Error al eliminar la Idioma.');
        }
    };

    const handleDeleteSkill = async (section, index) => {
        const itemToDelete = formData[section][index];

        // Confirmar si el usuario realmente desea eliminar el ítem
        if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            return;
        }

        // Si el ítem aún no ha sido creado (id es null), solo elimínalo del frontend
        if (itemToDelete.id === null) {
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));
            return;
        }

        // Si el ítem tiene un id (ya ha sido creado), procede con la eliminación en la API
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        try {
            // Realiza la solicitud DELETE a la API
            const response = await fetch(`/api/user/${userId}/skills/delete?id=${itemToDelete.id}`, {
                method: 'DELETE',
                headers
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar la Skill');
            }

            // Elimina la Skill del estado local
            setFormData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));

            alert('Skill eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar Skill:', error);
            alert('Error al eliminar la Skill.');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/auth/login');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try {
            // Separar datos existentes (con id) y nuevos (sin id)
            const existingData = {
                habilidades: formData.skills.filter(item => item.id),
                idiomas: formData.idiomas.filter(item => item.id),
                experiencias: formData.experiencia.filter(item => item.id),
                educaciones: formData.educacion.filter(item => item.id),
                certificaciones: formData.certificaciones.filter(item => item.id),
            };

            const newData = {
                habilidades: formData.skills.filter(item => !item.id),
                idiomas: formData.idiomas.filter(item => !item.id),
                experiencias: formData.experiencia.filter(item => !item.id),
                educaciones: formData.educacion.filter(item => !item.id),
                certificaciones: formData.certificaciones.filter(item => !item.id),
            };

            // Primero actualizar los datos existentes
            if (Object.values(existingData).some(arr => arr.length > 0)) {
                const updateResponse = await fetch(`/api/user/${userId}/Resume/updateCV`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(existingData)
                });
                const updateResult = await updateResponse.json();
                if (!updateResult.success) {
                    setStatusMessage('Error al actualizar el CV.');
                    return;
                }
            }

            // Luego crear los nuevos datos
            if (Object.values(newData).some(arr => arr.length > 0)) {
                const createResponse = await fetch(`/api/user/${userId}/Resume/createCompleteCV`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(newData)
                });
                const createResult = await createResponse.json();
                if (!createResult.success) {
                    setStatusMessage('Error al crear nuevos datos en el CV.');
                    return;
                }
            }

            setStatusMessage('CV actualizado exitosamente.');
            // Redirigir tras 3 segundos
            setTimeout(() => {
                router.push(previousPath || `/home/user/${userId}`);
            }, 3000);

        } catch (error) {
            console.error('Error updating CV:', error);
            setStatusMessage('Hubo un error al actualizar el CV.');
        }
    };

    const handleGoBack = () => {
        router.back(); // Volver a la página anterior
    };



    if (loading) {
        return <p>Cargando datos...</p>;
    }


    return (
        <div className="p-6 max-w-8xl mx-auto bg-white shadow-lg rounded-lg space-y-6">
            {/* Flecha para regresar */}
            {/* Flecha para regresar */}
            <div className="flex items-center mb-6">
                <button
                    onClick={handleGoBack}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <ArrowLeftIcon
                        className="h-6 w-6 text-gray-700 cursor-pointer hover:text-primary transition"
                    />
                    <h2 className="text-2xl font-semibold text-gray-800 ml-4 py-2">Modificar CV</h2>
                </button>
            </div>

            {/* Título */}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Experiencia Laboral */}
                <section className="bg-blue-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">Experiencia Laboral</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.experiencia.map((exp, index) => (
                            <div key={index} className="border border-gray-300 p-4 rounded-md bg-white shadow-sm">
                                <input
                                    type="text"
                                    name="titulo_puesto"
                                    placeholder="Título del Puesto"
                                    value={exp.titulo_puesto}
                                    onChange={(e) => handleChange(e, "experiencia", index)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    name="empresa"
                                    placeholder="Empresa"
                                    value={exp.empresa}
                                    onChange={(e) => handleChange(e, "experiencia", index)}
                                    className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                />
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <input
                                        type="date"
                                        name="fecha_inicio"
                                        placeholder="Fecha de Inicio"
                                        value={exp.fecha_inicio}
                                        onChange={(e) => handleChange(e, "experiencia", index)}
                                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                    <input
                                        type="date"
                                        name="fecha_fin"
                                        placeholder="Fecha de Fin"
                                        value={exp.fecha_fin}
                                        onChange={(e) => handleChange(e, "experiencia", index)}
                                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <textarea
                                    name="descripcion"
                                    placeholder="Descripción"
                                    value={exp.descripcion}
                                    onChange={(e) => handleChange(e, "experiencia", index)}
                                    className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteExperience("experiencia", index)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors w-full flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                                    Eliminar Experiencia
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleAddItem("experiencia")}
                        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors w-full flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Agregar Experiencia
                    </button>
                </section>

                {/* Certificaciones */}
                <section className="bg-green-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-green-600">Certificaciones</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.certificaciones.map((cert, index) => (
                            <div key={index} className="border border-gray-300 p-4 rounded-md bg-white shadow-sm">
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre"
                                    value={cert.nombre}
                                    onChange={(e) => handleChange(e, "certificaciones", index)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                />
                                <input
                                    type="text"
                                    name="organizacionEmisora"
                                    placeholder="Organización Emisora"
                                    value={cert.organizacionEmisora}
                                    onChange={(e) => handleChange(e, "certificaciones", index)}
                                    className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                />
                                <input
                                    type="date"
                                    name="fechaObtencion"
                                    placeholder="Fecha de Obtención"
                                    value={cert.fechaObtencion}
                                    onChange={(e) => handleChange(e, "certificaciones", index)}
                                    className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                />
                                <textarea
                                    name="descripcion"
                                    placeholder="Descripción"
                                    value={cert.descripcion}
                                    onChange={(e) => handleChange(e, "certificaciones", index)}
                                    className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteCert("certificaciones", index)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors w-full flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                                    Eliminar Certificación
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleAddItem("certificaciones")}
                        className="mt-6 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors w-full flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Agregar Certificación
                    </button>
                </section>

                {/* Educación */}
                <section className="bg-yellow-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-600">Educación</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.educacion.map((edu, index) => (
                            <div key={index} className="border border-gray-300 p-4 rounded-md bg-white shadow-sm">
                                <input
                                    type="text"
                                    name="gradoObtenido"
                                    placeholder="Título"
                                    value={edu.gradoObtenido}
                                    onChange={(e) => handleChange(e, "educacion", index)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500"
                                />
                                <input
                                    type="text"
                                    name="institucion"
                                    placeholder="Institución"
                                    value={edu.institucion}
                                    onChange={(e) => handleChange(e, "educacion", index)}
                                    className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500"
                                />
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <input
                                        type="date"
                                        name="fechaInicio"
                                        placeholder="Fecha de Inicio"
                                        value={edu.fechaInicio}
                                        onChange={(e) => handleChange(e, "educacion", index)}
                                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500"
                                    />
                                    <input
                                        type="date"
                                        name="fechaFin"
                                        placeholder="Fecha de Fin"
                                        value={edu.fechaFin}
                                        onChange={(e) => handleChange(e, "educacion", index)}
                                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteEducation("educacion", index)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors w-full flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                                    Eliminar Educación
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleAddItem("educacion")}
                        className="mt-6 bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 transition-colors w-full flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Agregar Educación
                    </button>
                </section>

                {/* Idiomas */}
                <section className="bg-purple-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-600">Idiomas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.idiomas.map((idi, index) => (
                            <div key={index} className="border border-gray-300 p-4 rounded-md bg-white shadow-sm">
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Idioma"
                                    value={idi.nombre}
                                    onChange={(e) => handleChange(e, "idiomas", index)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                                />
                                <select
                                    name="nivelDominio"
                                    value={idi.nivelDominio}
                                    onChange={(e) => handleChange(e, "idiomas", index)}
                                    className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                                >
                                    <option value="" disabled>Selecciona el nivel de dominio</option>
                                    <option value="básico">Básico</option>
                                    <option value="intermedio">Intermedio</option>
                                    <option value="avanzado">Avanzado</option>
                                    <option value="experto">Experto</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteIdioma("idiomas", index)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors w-full flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                                    Eliminar Idioma
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleAddItem("idiomas")}
                        className="mt-6 bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors w-full flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Agregar Idioma
                    </button>
                </section>

                {/* Skills */}
                <section className="bg-teal-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-teal-600">Habilidades</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.skills.map((skill, index) => (
                            <div key={index} className="border border-gray-300 p-4 rounded-md bg-white shadow-sm">
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Habilidad"
                                    value={skill.nombre}
                                    onChange={(e) => handleChange(e, "skills", index)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                                />
                                <select
                                    name="nivelDominio"
                                    value={skill.nivelDominio}
                                    onChange={(e) => handleChange(e, "skills", index)}
                                    className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                                >
                                    <option value="" disabled>Selecciona el nivel de dominio</option>
                                    <option value="básico">Básico</option>
                                    <option value="intermedio">Intermedio</option>
                                    <option value="avanzado">Avanzado</option>
                                    <option value="experto">Experto</option>
                                </select>
                                <textarea
                                    name="descripcion"
                                    placeholder="Descripción"
                                    value={skill.descripcion}
                                    onChange={(e) => handleChange(e, "skills", index)}
                                    className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteSkill("skills", index)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors w-full flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                                    Eliminar Habilidad
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleAddItem("skills")}
                        className="mt-6 bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-600 transition-colors w-full flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Agregar Habilidad
                    </button>
                </section>

                {/* Botón para guardar cambios */}
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors w-full flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}