import axios from "axios";

const API_BASE = "https://chatbot-backend-bz65.vercel.app/api/faqs/";
const norm = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "");

export const fetchCategories = async () => {
  try {
    const res = await axios.get(API_BASE);
    const categories = res?.data?.categories;
    if (Array.isArray(categories)) return categories;

    // Fallback: derive categories from grouped FAQs
    const groups = res?.data?.faqs?.faqs;
    if (Array.isArray(groups)) {
      return [...new Set(groups.map((g) => g?.category).filter(Boolean))];
    }

    return [];
  } catch (e) {
    console.error("fetchCategories error:", e?.message || e);
    return [];
  }
};

export const fetchFAQsByCategory = async (category) => {
  try {
    console.log("fetching....");

    const res = await axios.get(`${API_BASE}${category}`);
    const data = res.data;
    console.log(data);
    const selected = norm(category);

    // Case 1: single category object with nested faqs
    if (
      data &&
      typeof data === "object" &&
      norm(data.category || "") === selected &&
      data.faqs &&
      Array.isArray(data.faqs.faqs)
    ) {
      return data.faqs.faqs;
    }

    // Case 2: grouped categories array
    if (data?.faqs?.faqs && Array.isArray(data.faqs.faqs)) {
      let found = data.faqs.faqs.find((g) => norm(g.category) === selected);
      if (found && Array.isArray(found.faqs)) return found.faqs;
    }

    return [];
  } catch (e) {
    console.error(`fetchFAQsByCategory "${category}" error:`, e?.message || e);
    return [];
  }
};

export const fetchOrders = async () => {
  try {
    return [
      {
        id: "OD1234",
        date: "12th Oct 25, 10:31 am",
        price: "₹64.54",
        status: "placed",
        products: [
          {
            name: "Biscuit Pack",
            image:
              "https://media.istockphoto.com/id/503257367/photo/nabisco-oreo-milks-favorite-cookie-family-size-package.jpg?s=612x612&w=0&k=20&c=Tj2XBpV8w86xB76Zo-0nuENY7DvqNKZ2gxgv8jAZxWI=",
          },
          {
            name: "Soft Drink",
            image:
              "https://media.istockphoto.com/id/157726102/photo/classical-coca-cola-bottle.jpg?s=612x612&w=0&k=20&c=7s9UKO9O8ti8ELyt0A6-Rek-WITTG2m9y6joO8ETx8s=",
          },
          {
            name: "Soft Drink",
            image:
              "https://media.istockphoto.com/id/517416636/photo/milk-carton-with-custom-design.jpg?s=612x612&w=0&k=20&c=EoVARTiF1qDuPBPdDYPPlb0N8goW5RSBXcNV-eGR-7U=",
          },
        ],
      },
      {
        id: "OD1235",
        date: "12th Oct 25, 10:31 am",
        price: "₹64.54",
        status: "delivered",
        products: [
          {
            name: "Biscuit Pack",
            image:
              "https://media.istockphoto.com/id/503257367/photo/nabisco-oreo-milks-favorite-cookie-family-size-package.jpg?s=612x612&w=0&k=20&c=Tj2XBpV8w86xB76Zo-0nuENY7DvqNKZ2gxgv8jAZxWI=",
          },
          {
            name: "Soft Drink",
            image:
              "https://media.istockphoto.com/id/157726102/photo/classical-coca-cola-bottle.jpg?s=612x612&w=0&k=20&c=7s9UKO9O8ti8ELyt0A6-Rek-WITTG2m9y6joO8ETx8s=",
          },
          {
            name: "Soft Drink",
            image:
              "https://media.istockphoto.com/id/517416636/photo/milk-carton-with-custom-design.jpg?s=612x612&w=0&k=20&c=EoVARTiF1qDuPBPdDYPPlb0N8goW5RSBXcNV-eGR-7U=",
          },
        ],
      },
      {
        id: "order3",
        date: "5th Oct 25, 2:15 pm",
        price: "₹120.00",
        status: "returned",
        products: [
          {
            name: "Potato Chips",
            image:
              "https://media.istockphoto.com/id/1395132474/vector/potato-chips-package-design-realistic-vegetable-snacks-fast-food-product-mockup-frying.jpg?s=612x612&w=0&k=20&c=iYYn3vGk4MfR0rJYJkNVuy5ub6xuGpYgAcOWa7q2s5I=",
          },
          {
            name: "Juice Pack",
            image:
              "https://media.istockphoto.com/id/120756429/photo/orange-and-grapefruit-juice-bottles.jpg?s=612x612&w=0&k=20&c=8cIiZMKQZRp_YbG_yG1xGHu-rIbGVu2MxYNqGvP_bd0=",
          },
          {
            name: "Juice Pack",
            image:
              "https://media.istockphoto.com/id/458686239/photo/galaxy-chocolate-bar.jpg?s=612x612&w=0&k=20&c=4K648sx8D_sl7Tbhsk5zqdMQi_mqKcZk9s6TY-v1L-A=",
          },
        ],
      },
      {
        id: "order4",
        date: "29th Sep 25, 8:40 am",
        price: "₹89.99",
        status: "replaced",
        products: [
          {
            name: "Noodles",
            image:
              "https://media.istockphoto.com/id/2226941037/photo/blackberries-in-a-plastic-box-on-a-white-background-top-view.jpg?s=612x612&w=0&k=20&c=0IBBSwO7Iok7MHeBz1JOXdbXpMlNRKAcQEaPtsTvufI=",
          },
          {
            name: "Soup Mix",
            image:
              "https://media.istockphoto.com/id/1080387884/photo/cherry-tomatoes-in-a-plastic-container-fresh-cherry-tomatoes-in-box-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=6aQnuDDyM5VZfdlVdnzBsukGPwZ0djCHGzVV4QeGdP0=",
          },
          {
            name: "Soup Mix",
            image:
              "https://media.istockphoto.com/id/2204149529/photo/a-dozen-glazed-doughnuts.jpg?s=612x612&w=0&k=20&c=cgm1LZpo-qmDbz36RbYCK3QGPQff6ohf8mrVISfwHsE=",
          },
        ],
      },
    ];
  } catch (error) {
    console.error("Error fetching orders:", error.message || error);
    return [];
  }
};
