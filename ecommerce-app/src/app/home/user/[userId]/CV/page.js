"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
                const cvRes = await fetch(`/api/user/${userId}/getCV`, { method: 'GET', headers });
                const cvData = await cvRes.json();

                if (cvData?.data) {
                    setFormData({
                        skills: cvData.data.habilidades || [],
                        idiomas: cvData.data.idiomas || [],
                        experiencia: cvData.data.experiencias || [],
                        educacion: cvData.data.educaciones || [],
                        certificaciones: cvData.data.certificaciones || []
                    });
                    setHasData(true);
                } else {
                    // No hay datos guardados, formData permanece vacío
                    setHasData(false);
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
            experiencia: { titulo_puesto: '', empresa: '', ubicacion: '', fecha_inicio: '', fecha_fin: '', descripcion: '' },
            certificaciones: { nombre: '', organizacionEmisora: '', fechaObtencion: '', descripcion: '' },
            educacion: { gradoObtenido: '', institucion: '', fechaInicio: '', fechaFin: '' },
            idiomas: { nombre: '', nivelDominio: '' },
            skills: { nombre: '', nivelDominio: '', descripcion: '' }
        };

        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem[section]]
        }));
    };

    const handleDeleteItem = async (section, index) => {
        const itemToDelete = formData[section][index];

        if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            return;
        }

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

        if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            return;
        }

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

    const handleDeleteEducation = async (section, index) => {
        const itemToDelete = formData[section][index];

        if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            return;
        }

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

    const handleDeleteIdioma = async (section, index) => {
        const itemToDelete = formData[section][index];

        if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            return;
        }

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

    const handleDeleteSkill = async (section, index) => {
        const itemToDelete = formData[section][index];

        if (!window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            return;
        }

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
            // Determinar si estamos actualizando o creando el CV
            const method = hasData ? 'PUT' : 'POST';
            const endpoint = hasData ? `/api/user/${userId}/updateCV` : `/api/user/${userId}/createCompleteCV`;

            // Enviar los datos a la API
            const response = await fetch(endpoint, {
                method,
                headers,
                body: JSON.stringify({
                    habilidades: formData.skills,
                    idiomas: formData.idiomas,
                    experiencias: formData.experiencia,
                    educaciones: formData.educacion,
                    certificaciones: formData.certificaciones,
                })
            });

            const result = await response.json();

            if (result.success) {
                setStatusMessage('CV actualizado exitosamente.');
            } else {
                setStatusMessage('Error al actualizar el CV.');
            }

            // Redirigir tras 3 segundos
            setTimeout(() => {
                router.push(previousPath || `/home/user/${userId}`);
            }, 3000);

        } catch (error) {
            console.error('Error updating CV:', error);
            setStatusMessage('Hubo un error al actualizar el CV.');
        }
    };

    if (loading) {
        return <p>Cargando datos...</p>;
    }


    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Modificar CV</h1>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Experiencia Laboral */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Experiencia Laboral</h2>
                    {formData.experiencia.map((exp, index) => (
                        <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md">
                            <input
                                type="text"
                                name="titulo_puesto"
                                placeholder="Título del Puesto"
                                value={exp.titulo_puesto}
                                onChange={(e) => handleChange(e, 'experiencia', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="text"
                                name="empresa"
                                placeholder="Empresa"
                                value={exp.empresa}
                                onChange={(e) => handleChange(e, 'experiencia', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="text"
                                name="ubicacion"
                                placeholder="Ubicación"
                                value={exp.ubicacion}
                                onChange={(e) => handleChange(e, 'experiencia', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="date"
                                name="fecha_inicio"
                                placeholder="Fecha de Inicio"
                                value={exp.fecha_inicio}
                                onChange={(e) => handleChange(e, 'experiencia', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="date"
                                name="fecha_fin"
                                placeholder="Fecha de Fin"
                                value={exp.fecha_fin}
                                onChange={(e) => handleChange(e, 'experiencia', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <textarea
                                name="descripcion"
                                placeholder="Descripción"
                                value={exp.descripcion}
                                onChange={(e) => handleChange(e, 'experiencia', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteExperience('experiencia', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar Experiencia
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem('experiencia')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Agregar Experiencia
                    </button>
                </div>

                {/* Certificaciones */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Certificaciones</h2>
                    {formData.certificaciones.map((cert, index) => (
                        <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={cert.nombre}
                                onChange={(e) => handleChange(e, 'certificaciones', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="text"
                                name="organizacionEmisora"
                                placeholder="Organización Emisora"
                                value={cert.organizacionEmisora}
                                onChange={(e) => handleChange(e, 'certificaciones', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="date"
                                name="fechaObtencion"
                                placeholder="Fecha de Obtención"
                                value={cert.fechaObtencion}
                                onChange={(e) => handleChange(e, 'certificaciones', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <textarea
                                name="descripcion"
                                placeholder="Descripción"
                                value={cert.descripcion}
                                onChange={(e) => handleChange(e, 'certificaciones', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteItem('certificaciones', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar Certificación
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem('certificaciones')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Agregar Certificación
                    </button>
                </div>

                {/* Educación */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Educación</h2>
                    {formData.educacion.map((edu, index) => (
                        <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md">
                            <input
                                type="text"
                                name="gradoObtenido"
                                placeholder="Título"
                                value={edu.gradoObtenido}
                                onChange={(e) => handleChange(e, 'educacion', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="text"
                                name="institucion"
                                placeholder="Institución"
                                value={edu.institucion}
                                onChange={(e) => handleChange(e, 'educacion', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="date"
                                name="fechaInicio"
                                placeholder="Fecha de Inicio"
                                value={edu.fechaInicio}
                                onChange={(e) => handleChange(e, 'educacion', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="date"
                                name="fechaFin"
                                placeholder="Fecha de Fin"
                                value={edu.fechaFin}
                                onChange={(e) => handleChange(e, 'educacion', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteEducation('educacion', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar Educación
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem('educacion')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Agregar Educación
                    </button>
                </div>

                {/* Idiomas */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Idiomas</h2>
                    {formData.idiomas.map((idi, index) => (
                        <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Idioma"
                                value={idi.nombre}
                                onChange={(e) => handleChange(e, 'idiomas', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <select
                                name="nivelDominio"
                                value={idi.nivelDominio}
                                onChange={(e) => handleChange(e, 'idiomas', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            >
                                <option value="" disabled>
                                    Selecciona el nivel de dominio
                                </option>
                                <option value="básico">Básico</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                                <option value="experto">Experto</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => handleDeleteIdioma('idiomas', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar Idioma
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem('idiomas')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Agregar Idioma
                    </button>
                </div>

                {/* Skills */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Skills</h2>
                    {formData.skills.map((skill, index) => (
                        <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Habilidad"
                                value={skill.nombre}
                                onChange={(e) => handleChange(e, 'skills', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <select
                                name="nivelDominio"
                                value={skill.nivelDominio}
                                onChange={(e) => handleChange(e, 'skills', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            >
                                <option value="" disabled>
                                    Selecciona el nivel de dominio
                                </option>
                                <option value="básico">Básico</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                                <option value="experto">Experto</option>
                            </select>
                            <textarea
                                name="descripcion"
                                placeholder="Descripción"
                                value={skill.descripcion}
                                onChange={(e) => handleChange(e, 'skills', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteSkill('skills', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar Skill
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem('skills')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Agregar Skill
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}
