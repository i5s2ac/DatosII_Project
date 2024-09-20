"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCV({ params }) {
    const { userId } = params;
    const initialFormData = () => ({
        experiencia: [{ titulo_puesto: '', empresa: '', ubicacion: '', fecha_inicio: '', fecha_fin: '', descripcion: '' }],
        certificaciones: [{ nombre: '', organizacionEmisora: '', fechaObtencion: '', descripcion: '' }],
        educacion: [{ institucion: '', gradoObtenido: '', campoEstudio: '', fechaInicio: '', fechaFin: '' }],
        idiomas: [{ nombre: '', nivelDominio: '' }],
        skills: [{ nombre: '', nivelDominio: '', descripcion: '' }]
    });

    const [formData, setFormData] = useState(initialFormData());
    const [username, setUsername] = useState('');
    const [previousPath, setPreviousPath] = useState('');
    const [statusMessage, setStatusMessage] = useState('');  // Nuevo estado para el mensaje de éxito o error
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const res = await fetch(`/api/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();

            if (data.success && data.user.id === parseInt(userId)) {
                setUsername(data.user.username);
            } else {
                router.push('/auth/login');
            }
        };

        fetchUser();
        setPreviousPath(document.referrer);  // Guardar la URL anterior
    }, [router, userId]);

    const handleChange = (e, section, index) => {
        const { name, value } = e.target;
        const newData = Array.isArray(formData[section]) ? [...formData[section]] : [];

        if (index >= newData.length) {
            newData.push({});
        }

        newData[index] = { ...newData[index], [name]: value };

        setFormData(prev => ({
            ...prev,
            [section]: newData
        }));
    };

    const handleAdd = (section) => {
        const emptyEntry = {
            nombre: '', organizacionEmisora: '', fechaObtencion: '', descripcion: ''
        };

        if (section === 'experiencia') {
            Object.assign(emptyEntry, {
                titulo_puesto: '', empresa: '', ubicacion: '', fecha_inicio: '', fecha_fin: '', descripcion: ''
            });
        } else if (section === 'educacion') {
            Object.assign(emptyEntry, {
                institucion: '', gradoObtenido: '', campoEstudio: '', fechaInicio: '', fechaFin: ''
            });
        } else if (section === 'idiomas') {
            Object.assign(emptyEntry, {
                nombre: '', nivelDominio: ''
            });
        } else if (section === 'skills') {
            Object.assign(emptyEntry, {
                nombre: '', nivelDominio: '', descripcion: ''
            });
        }

        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], emptyEntry]
        }));
    };

    const handleRemove = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
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
            const response = await fetch(`/api/user/${userId}/Resume/createCompleteCV`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    habilidades: formData.skills.length > 0 ? formData.skills : [],
                    idiomas: formData.idiomas.length > 0 ? formData.idiomas : [],
                    experiencias: formData.experiencia.length > 0 ? formData.experiencia : [],
                    educaciones: formData.educacion.length > 0 ? formData.educacion : [],
                    certificaciones: formData.certificaciones.length > 0 ? formData.certificaciones : []
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage(data.message || 'CV creado exitosamente.');
                setTimeout(() => {
                    router.push(previousPath || `/home/user/${userId}`);
                }, 3000);  // Redirigir tras 3 segundos
            } else {
                setStatusMessage(data.message || 'Hubo un error al crear el CV.');
            }
        } catch (error) {
            console.error('Error creating CV:', error);
            setStatusMessage('Hubo un error al crear el CV.');
        }
    };


    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Crear CV</h1>

            {/* Mostrar mensaje de éxito o error */}
            {statusMessage && (
                <p className={`mb-4 ${statusMessage.includes('exitosamente') ? 'text-green-600' : 'text-red-600'}`}>
                    {statusMessage}
                </p>
            )}
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
                                onClick={() => handleRemove('experiencia', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar Experiencia
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAdd('experiencia')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Añadir Experiencia
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
                                onClick={() => handleRemove('certificaciones', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar Certificación
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAdd('certificaciones')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Añadir Certificación
                    </button>
                </div>

                {/* Educación */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Educación</h2>
                    {formData.educacion.map((edu, index) => (
                        <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md">
                            <input
                                type="text"
                                name="institucion"
                                placeholder="Institución"
                                value={edu.institucion}
                                onChange={(e) => handleChange(e, 'educacion', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="text"
                                name="gradoObtenido"
                                placeholder="Grado Obtenido"
                                value={edu.gradoObtenido}
                                onChange={(e) => handleChange(e, 'educacion', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <input
                                type="text"
                                name="campoEstudio"
                                placeholder="Campo de Estudio"
                                value={edu.campoEstudio}
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
                                onClick={() => handleRemove('educacion', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar Educación
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAdd('educacion')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Añadir Educación
                    </button>
                </div>

                {/* Idiomas */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Idiomas</h2>
                    {formData.idiomas.map((idioma, index) => (
                        <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={idioma.nombre}
                                onChange={(e) => handleChange(e, 'idiomas', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <select
                                name="nivelDominio"
                                value={idioma.nivelDominio}
                                onChange={(e) => handleChange(e, 'idiomas', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            >
                                <option value="" disabled>Selecciona el nivel de dominio</option>
                                <option value="básico">Básico</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                                <option value="experto">Experto</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => handleRemove('idiomas', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar Idioma
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAdd('idiomas')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Añadir Idioma
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
                                placeholder="Nombre"
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
                                onChange={(e) => handleChange(e, 'skills', index)}
                                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove('skills', index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar Skill
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAdd('skills')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Añadir Skill
                    </button>
                </div>

                <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
                >
                    Crear CV
                </button>
            </form>
        </div>
    );
}
