import { useEffect, useState } from "react";

function Orders() {

  const [orders, setOrders] =
    useState([]);

  async function loadOrders() {

    try {

      const res = await fetch(
        "import.meta.env.VITE_API_URL/api/orders"
      );

      const data =
        await res.json();

      setOrders(
        data.orders || []
      );

    } catch (error) {

      console.error(error);
    }
  }

  async function updateStatus(
    id,
    status
  ) {

    try {

      await fetch(
        `import.meta.env.VITE_API_URL/api/orders/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      loadOrders();

    } catch (error) {

      console.error(error);
    }
  }

  useEffect(() => {

    loadOrders();

  }, []);

  return (

    <div className="p-6">

      <h1
        className="
          text-4xl
          font-bold
          mb-8
        "
      >
        Orders
      </h1>

      <div className="space-y-4">

        {orders.map((order) => (

          <div
            key={order.id}
            className="
              bg-white
              shadow
              rounded-xl
              p-4
            "
          >

            <h3
              className="
                font-bold
                text-xl
              "
            >
              {order.customerName}
            </h3>

            <p>
              Product:
              {" "}
              {order.productName}
            </p>

            <p>
              Phone:
              {" "}
              {order.phoneNumber}
            </p>

            <p>
              Quantity:
              {" "}
              {order.quantity}
            </p>

            <p>
              Total:
              ₦{order.totalPrice}
            </p>

            <p>
              Status:
              {" "}
              <strong>
                {order.status}
              </strong>
            </p>

            <div
              className="
                flex
                gap-2
                mt-4
              "
            >

              <button
                onClick={() =>
                  updateStatus(
                    order.id,
                    "Confirmed"
                  )
                }
                className="
                  bg-blue-600
                  text-white
                  px-3
                  py-2
                  rounded
                "
              >
                Confirm
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order.id,
                    "Out For Delivery"
                  )
                }
                className="
                  bg-orange-500
                  text-white
                  px-3
                  py-2
                  rounded
                "
              >
                Dispatch
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order.id,
                    "Delivered"
                  )
                }
                className="
                  bg-green-600
                  text-white
                  px-3
                  py-2
                  rounded
                "
              >
                Delivered
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Orders;