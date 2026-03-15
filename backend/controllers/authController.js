import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'Student',
        });

        if (user) {
            generateTokenAndSetCookie(res, user._id);
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                supervisor: user.supervisor,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            generateTokenAndSetCookie(res, user._id);
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                supervisor: user.supervisor,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'User logged out successfully' });
};

export const getMe = async (req, res) => {
    res.status(200).json(req.user);
};
