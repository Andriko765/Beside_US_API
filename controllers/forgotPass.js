const User = require("../models/User");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const sendMail = require("@sendgrid/mail");

sendMail.setApiKey(process.env.SENDGRID_KEY_SECRET);

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Користувача не знайдено" });
    }

    const resetToken = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;

    const msg = {
      to: email,
      from: "ama.hub.klm@gmail.com",
      subject: "Відновлення пароля",
      text: `Кликайте на цей лінк щоб відновити свій пароль: ${resetURL}`,
      html: ` <p>Будь ласка, перейдіть за цим посиланням, щоб відновити свій пароль:</p><a href="${resetURL}">${resetURL}</a>`,
    };

    await sendMail.send(msg);
    res
      .status(200)
      .json({ message: "Посилання для відновлення пароля надіслано на email" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Помилка сервера, спробуйте пізніше" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Невірне або прострочене посилання" });
    }

    const hashedPassword = await argon2.hash(newPassword);

    user.password = hashedPassword;
    res.status(200).json({ message: "Пароль успішно змінено" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Помилка сервера, спробуйте пізніше" });
  }
};
