import { useEffect, useState } from "react";

function Settings() {

  const [settings, setSettings] =
    useState({

      businessName: "",

      whatsappNumber: "",

      address: "",

      deliveryFee: 0,

      logoUrl: "",

      bannerUrl: "",

    });

  async function loadSettings() {

    try {

      const res = await fetch(
        "import.meta.env.VITE_API_URL/api/settings"
      );

      const data =
        await res.json();

      if (data.success) {

        setSettings(
          data.settings
        );

      }

    } catch (error) {

      console.error(error);

    }

  }

  useEffect(() => {

    loadSettings();

  }, []);

  async function saveSettings() {

    try {

      const res = await fetch(
        "http://10.249.76.124:3000/api/settings",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            settings
          ),
        }
      );

      const data =
        await res.json();

      if (data.success) {

        alert(
          "Settings saved successfully"
        );

      }

    } catch (error) {

      console.error(error);

    }

  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <h1
        className="
          text-4xl
          font-bold
          mb-8
        "
      >
        Business Settings
      </h1>

      <div
        className="
          bg-white
          rounded-2xl
          shadow-lg
          p-6
          max-w-3xl
        "
      >

        <div className="grid gap-4">

          <input
            type="text"
            placeholder="Business Name"
            value={
              settings.businessName
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                businessName:
                  e.target.value,
              })
            }
            className="
              border
              p-3
              rounded-lg
            "
          />

          <input
            type="text"
            placeholder="WhatsApp Number"
            value={
              settings.whatsappNumber
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                whatsappNumber:
                  e.target.value,
              })
            }
            className="
              border
              p-3
              rounded-lg
            "
          />

          <input
            type="text"
            placeholder="Business Address"
            value={
              settings.address
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                address:
                  e.target.value,
              })
            }
            className="
              border
              p-3
              rounded-lg
            "
          />

          <input
            type="number"
            placeholder="Delivery Fee"
            value={
              settings.deliveryFee
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                deliveryFee:
                  Number(
                    e.target.value
                  ),
              })
            }
            className="
              border
              p-3
              rounded-lg
            "
          />

          <input
            type="text"
            placeholder="Logo URL"
            value={
              settings.logoUrl || ""
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                logoUrl:
                  e.target.value,
              })
            }
            className="
              border
              p-3
              rounded-lg
            "
          />

          <input
            type="text"
            placeholder="Banner URL"
            value={
              settings.bannerUrl || ""
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                bannerUrl:
                  e.target.value,
              })
            }
            className="
              border
              p-3
              rounded-lg
            "
          />

          <button
            onClick={saveSettings}
            className="
              bg-green-600
              text-white
              py-3
              rounded-lg
              font-bold
            "
          >
            Save Settings
          </button>

        </div>

      </div>

    </div>

  );
}

export default Settings;