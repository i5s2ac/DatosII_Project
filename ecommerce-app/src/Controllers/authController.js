import sequelize from '../../src/lib/sequelize.js';
import User from '../../models/user.js';
import Empresa from '../../models/Empresa.js';
import EmpresaUsuario from '../../models/EmpresaUsuario.js';
import Industria from '../../models/Industria.js';
import Rol from '../../models/rol.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Función para iniciar sesión (login) de usuario
export const loginUser = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }

        const empresaUsuario = await EmpresaUsuario.findOne({ where: { usuarioId: user.id } });

        const tokenPayload = {
            id: user.id,
            email: user.email,
            empresaId: empresaUsuario ? empresaUsuario.empresaId : null,
            rolId: empresaUsuario ? empresaUsuario.rolId : null,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            token,
            userId: user.id,
            empresaId: empresaUsuario ? empresaUsuario.empresaId : null,
            rolId: empresaUsuario ? empresaUsuario.rolId : null,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


// Función para registrar un nuevo usuario
export const registerUser = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        await sequelize.authenticate();
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, telefono: phone });

        return res.status(201).json({ success: true, user });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Función para registrar una empresa junto con un usuario
export const registerCompany = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const {
        username,
        email,
        password,
        phone,
        companyName,
        direccion,
        descripcion,
        sitioWeb
    } = req.body;

    if (!username || !email || !password || !phone || !companyName) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        await sequelize.authenticate();

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, telefono: phone });

        const empresa = await Empresa.create({
            nombre: companyName,
            direccion,
            telefono: phone,
            email,
            descripcion,
            sitioWeb,
            industriaId: 1,  // Asignar un valor por defecto o dinámico
        });

        let adminRole = await Rol.findOne({ where: { nombre: 'Admin' } });
        if (!adminRole) {
            adminRole = await Rol.create({ nombre: 'Admin', descripcion: 'Administrator of the company' });
        }

        await EmpresaUsuario.create({ empresaId: empresa.id, usuarioId: user.id, rolId: adminRole.id });

        return res.status(201).json({ success: true, empresa, user });
    } catch (error) {
        console.error('Error registering company and user:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Función para obtener industrias
export const getIndustries = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        await sequelize.authenticate();

        const industrias = await Industria.findAll({
            attributes: ['id', 'nombre']
        });

        return res.status(200).json(industrias);
    } catch (error) {
        console.error('Error fetching industries:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
