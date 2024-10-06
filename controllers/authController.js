const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const registerUser = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ message: 'Користувач вже існує' });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: 'Email вже існує' });
		}

		const hashedPassword = await argon2.hash(password);

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			isVerified: false,
		});

		const savedUser = await newUser.save();

		const emailToken = jwt.sign({ id: savedUser }, process.env.JWT_SECRET);

		const url = `http://localhost:5000/api/auth/confirm/${emailToken}`;

		const msg = {
			to: email,
			from: 'ama.hub.klm@gmail.com',
			subject: 'Підтвердітьт email',
			html: `Натисніть на посилання для підтвердження вашої реєстрації: <a href="${url}">${url}</a>`,
		};

		await sgMail.send(msg);
		// await newUser.save();
		res.status(201).json({ message: 'Користувача успішно зареєстровано' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Помилка сервера,спобуйте пізніше' });
	}
};

const confirmEmail = async (req, res) => {
	const token = req.params.token; // Отримуємо токен з URL параметрів
	console.log('Token from URL:', token);
	if (!token) {
		return res.status(400).json({ message: 'Відсутній токен' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log('Decoded token:', decoded);
		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(404).json({ message: 'НЕ валідний токен' });
		}

		if (user.isVerified) {
			return res.status(400).json({ message: 'Ваш email вже підтверджений' });
		}

		user.isVerified = true;

		await user.save();

		res.status(200).json({ message: 'Email  успішно підтвердженно' });
	} catch (error) {
		console.log('Помилка підтвердженнч email:', error);
		res.status(500).json({ message: 'Помилка сервера' });
	}
};

const loginUser = async (req, res) => {
	const { login, password } = req.body;
	try {
		if (!login || !password) {
			return res.status(400).json({ message: 'Заповніть всі поля' });
		}

		const user = await User.findOne({
			$or: [{ email: login }, { username: login }],
		});

		if (!user) {
			return res.status(400).json({ message: "Невірне і'мя користувача" });
		}

		const validPassword = await argon2.verify(user.password, password);
		if (!validPassword) {
			return res.status(400).json({ message: 'Невірний пароль' });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		res.json({ message: 'Вхід успішний', token });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Помилка сервера, спробуйте пізніше' });
	}
};
module.exports = { registerUser, loginUser, confirmEmail };
