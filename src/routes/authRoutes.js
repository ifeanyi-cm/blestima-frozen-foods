const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const { PrismaClient } =
  require("@prisma/client");

const prisma =
  new PrismaClient();

/*
|--------------------------------------------------------------------------
| LOGIN ADMIN
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  async (req, res) => {

    try {

      const {
        username,
        password,
      } = req.body;

      const admin =
        await prisma.admin.findUnique({
          where: {
            username,
          },
        });

      if (!admin) {

        return res.status(401).json({
          success: false,
          message:
            "Invalid username or password",
        });

      }

      const validPassword =
        await bcrypt.compare(
          password,
          admin.password
        );

      if (!validPassword) {

        return res.status(401).json({
          success: false,
          message:
            "Invalid username or password",
        });

      }

      const token =
        jwt.sign(
          {
            id: admin.id,
            username:
              admin.username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.json({
        success: true,
        token,
        username:
          admin.username,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Login failed",
      });

    }

  }
);

module.exports = router;