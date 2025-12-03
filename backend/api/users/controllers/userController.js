import User from "../models/User.js"; // Ajusta el path según donde esté tu modelo User
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // Validación básica de entrada
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Faltan campos: name, email o password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email ya registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Verificar que exista la variable de entorno JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      // No firmamos token si no hay secret, pero devolvemos usuario sin password
      const userToReturn = newUser.toObject ? newUser.toObject() : { ...newUser };
      delete userToReturn.password;
      console.error('JWT_SECRET no definida en process.env');
      return res.status(500).json({ msg: 'JWT_SECRET no definida en el servidor', user: userToReturn });
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const userToReturn = newUser.toObject ? newUser.toObject() : { ...newUser };
    delete userToReturn.password;

    res.status(201).json({ token, user: userToReturn });
  } catch (error) {
    console.error('Error en register user:', error);
    // Enviar mensaje más claro al cliente
    res.status(500).json({ msg: "Error en registro", error: error.message || error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ msg: "Faltan campos: email o password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET no definida en process.env (login)');
      const userToReturn = user.toObject ? user.toObject() : { ...user };
      delete userToReturn.password;
      return res.status(500).json({ msg: 'JWT_SECRET no definida en el servidor', user: userToReturn });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const userToReturn = user.toObject ? user.toObject() : { ...user };
    delete userToReturn.password;

    res.json({ token, user: userToReturn });
  } catch (error) {
    console.error('Error en login user:', error);
    res.status(500).json({ msg: 'Error en login', error: error.message || error });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // No envíes la contraseña
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuarios", error });
  }
};

export const getRepartidores = async (req, res) => {
  try {
    const repartidores = await User.find({ role: "repartidor" }).select("_id name email");
    res.json(repartidores);
  } catch (error) {
    console.error('Error al obtener repartidores:', error);
    res.status(500).json({ msg: "Error al obtener repartidores", error: error.message || error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role, password } = req.body || {};
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    const userToReturn = user.toObject ? user.toObject() : { ...user };
    delete userToReturn.password;
    res.json(userToReturn);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar usuario", error: error.message || error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar usuario", error: error.message || error });
  }
};

