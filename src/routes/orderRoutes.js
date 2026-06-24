const express = require("express");

const router = express.Router();

const prisma = require("../db/prisma");

/*
|--------------------------------------------------------------------------
| GET ALL ORDERS
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {

  try {

    const orders =
      await prisma.order.findMany({

        orderBy: {
          createdAt: "desc",
        },

      });

    res.json({
      success: true,
      orders,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });

  }

});

/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {

  try {

    const {
      customerName,
      phoneNumber,
      productName,
      quantity,
      totalPrice,
    } = req.body;

    const order =
      await prisma.order.create({

        data: {
          customerName,
          phoneNumber,
          productName,
          quantity,
          totalPrice,
        },

      });

    res.json({
      success: true,
      order,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });

  }

});

/*
|--------------------------------------------------------------------------
| UPDATE ORDER STATUS
|--------------------------------------------------------------------------
*/

router.put("/:id", async (req, res) => {

  try {

    const id =
      parseInt(req.params.id);

    const {
      status,
    } = req.body;

    const order =
      await prisma.order.update({

        where: {
          id,
        },

        data: {
          status,
        },

      });

    res.json({
      success: true,
      order,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to update order",
    });

  }

});

module.exports = router;