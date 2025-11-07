import AsyncStorage from "@react-native-async-storage/async-storage";

export function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // convert to 12-hour format
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${hours}:${formattedMinutes} ${ampm}`;
}

export const delay = (ms) => {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve("promise resolved");
    }, ms)
  );
};

export const getInputText = (type, selectedItem) => {
  switch (type) {
    case "product_not_available":
      return "Please type out the brand and name of the product, and we will try our best to make it available on zippy.";
    case "enter_wrong_item_name":
      return "Please type out the brand and name of the product that you received instead:";
    case "other_reasons":
      return "Please specify reason to cancel the order";
    case "add_new_item":
      return "Please type out the brand, name and quantity of the product you want to add to your current order.";
    case "increase_quantity":
      return `How many "${selectedItem}" would you like now? (e.g. 2)`;
    case "other_issue":
      return "Please describe briefly what issue you faced with the delivery partner:";
    case "enter_quantity":
      return "Please enter the quantity you actually received";
    case "customized_time_slot":
      return "Please enter your preferred time slot";
    default:
      break;
  }
};

export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("messages", jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("messages");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};
