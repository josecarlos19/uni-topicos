const knexC = require("knex");
const config = require("../../../knexfile");
const knex = knexC(config.development);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function checkPassword(payloadPassword, userPasswordHashed) {
  return bcrypt.compare(payloadPassword, userPasswordHashed);
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, roles: JSON.parse(user.roles) },
    process.env.APP_SECRET,
    {
      expiresIn: "30d",
    }
  );
}

class SessionController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await knex
        .select()
        .from("users")
        .where("email", email)
        .first();

      if (!user) {
        return res.status(401).json({ message: "unregistered email" });
      }

      if (!(await checkPassword(password, user.password))) {
        return res.status(401).json({ message: "Incorrect Password" });
      }

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          accessToken: generateToken(user),
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new SessionController();
