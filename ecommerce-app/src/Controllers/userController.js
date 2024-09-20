import User from '@/../models/user';  // Ajusta la ruta según tu estructura
import { verifyToken } from '@/lib/auth';  // Ajusta la ruta según tu estructura
import { empresaUsuario } from '@/../models/EmpresaUsuario';  // Ajusta la ruta según sea necesario
import sequelize from '@/lib/sequelize';


// Función para obtener los datos del usuario basado en el token
export const getUserById = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }

    try {
        await sequelize.authenticate();

        console.log('Fetching user with ID:', decoded.id);
        const user = await User.findByPk(decoded.id, { attributes: ['id', 'username', 'email', 'telefono'] });

        if (user) {
            return res.status(200).json({ success: true, user });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error connecting to the database:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Función para actualizar los datos del usuario basado en el token
export const updateUserById = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }

    try {
        await sequelize.authenticate();

        const { username, email, telefono } = req.body;
        const user = await User.findByPk(decoded.id);

        if (user) {
            // Actualiza los datos del usuario
            user.username = username;
            user.email = email;
            user.telefono = telefono;

            await user.save();

            return res.status(200).json({ success: true, message: 'User updated successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Función para obtener los datos del usuario basado en el token y userId
export const getUserByIdWithAuth = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }

    if (!decoded) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    try {
        await sequelize.authenticate();

        const { userId } = req.query;

        // Verificar si el usuario coincide con el token
        if (parseInt(userId) !== decoded.id) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Buscar al usuario en la base de datos
        const user = await User.findByPk(userId, { attributes: ['id', 'username', 'email', 'telefono'] });

        if (user) {
            return res.status(200).json({ success: true, user });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error connecting to the database:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Función para verificar si un usuario está relacionado con una empresa
export const checkUserCompanyRelation = async (req, res) => {
    const { userId } = req.query;

    if (req.method === 'GET') {
        try {
            const result = await empresaUsuario.findOne({
                where: { usuarioId: parseInt(userId, 10) }
            });

            return res.status(200).json({ isInCompany: !!result });
        } catch (error) {
            console.error('Error al verificar la relación con la empresa:', error);
            return res.status(500).json({ error: 'Error al verificar la relación con la empresa' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

