const auth = require("../middleware/auth");

const express = require("express");

const router = express.Router();

const prisma = require("../db/prisma");

/*
|--------------------------------------------------------------------------
| GET ALL ORDERS
|--------------------------------------------------------------------------
*/

router.get("/", auth, async (req, res) => {

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

router.put("/:id", auth, async (req, res) => {

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

 /*
 |--------------------------------------------------------------------------
 | MONTHLY DELIVERED ORDERS SUMMARY
 |--------------------------------------------------------------------------
 */

router.get("/monthly-summary", auth, async (req, res) => {

  try {

    const now = new Date();

    const year =
      parseInt(req.query.year) ||
      now.getFullYear();

    const month =
      parseInt(req.query.month) ||
      now.getMonth() + 1;

    const startDate =
      new Date(year, month - 1, 1);

    const endDate =
      new Date(year, month, 1);

    const orders =
      await prisma.order.findMany({

        where: {
          status: "Delivered",

          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },

      });

    const totalSales =
      orders.reduce(
        (total, order) =>
          total +
          Number(order.totalPrice || 0),
        0
      );

    const totalQuantity =
      orders.reduce(
        (total, order) =>
          total +
          Number(order.quantity || 0),
        0
      );

    res.json({

      success: true,

      year,

      month,

      totalSales,

      deliveredOrders: orders.length,

      totalQuantity,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error:
        "Failed to fetch monthly summary",

    });

  }

});

module.exports = router;