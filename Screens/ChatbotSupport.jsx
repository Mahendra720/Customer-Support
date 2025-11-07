import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  // SafeAreaView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import Bot from "../Components/Bot";
import User from "../Components/User";
import TypingIndicator from "../Components/TypingIndicator";
import { delay, getData, getInputText, storeData } from "../lib/utils";
import InputModal from "../Components/InputModal";
import FeedbackModal from "../Components/FeedbackModal";
import * as ImagePicker from "expo-image-picker";

const initialState = {
  placed: [
    {
      type: "bot",
      message: "which concern may i help you with?",
      options: [
        {
          id: "order_status",
          name: "Order Status",
          category: "orders_related",
        },
        {
          id: "order_delayed",
          name: "Order Delayed",
          category: "orders_related",
        },
        {
          id: "modifying_order",
          name: "Modifying Order",
          // category: "orders_related",
        },
        // {
        //   id: "reschedule_order",
        //   name: "Reschedule Order",
        //   category: "orders_related",
        // },
        {
          id: "cancel_order",
          name: "Cancel Order",
          category: "cancel_order",
        },
      ],
    },
  ],
  delivered: [
    {
      type: "bot",
      message: "What issue are you facing with this Order?",
      options: [
        {
          id: "issue_with_products",
          name: "Return & Replacement",
        },
        {
          id: "issue_with_delivery_partner",
          name: "Issue with delivery partner",
        },
      ],
    },
  ],
  returned: [
    {
      type: "bot",
      message:
        "I see you've already placed a return request. How can I help you today?",
      options: [
        {
          id: "return_status",
          name: "Check return status",
          category: "returned_orders",
        },

        {
          id: "refund_status",
          name: "Check refund status",
          category: "returned_orders",
        },
        {
          id: "pickup_not_done",
          name: "Pickup not done yet",
          category: "returned_orders",
        },
        {
          id: "cancel_return",
          name: "Cancel my return request",
          category: "returned_orders",
        },
      ],
    },
  ],
  replaced: [
    {
      type: "bot",
      message: `Which concern may i help you with?`,
      options: [
        {
          id: "track_status",
          name: "Track replacement status",
          category: "replacement_queries",
        },
        {
          id: "delay_in_replacement",
          name: "Replacement delayed",
          category: "replacement_queries",
        },
        {
          id: "pickup_not_done",
          name: "Pickup not done yet",
          category: "replacement_queries",
        },
        {
          id: "not_received",
          name: "Didn’t receive replacement item",
          category: "replacement_queries",
        },
        {
          id: "cancel_replacement",
          name: "Cancel replacement request",
          category: "replacement_queries",
        },
      ],
    },
  ],
};

// home
// const BASE_URL = "http://10.223.171.9:8000/api";
// work
// const BASE_URL = "http://192.168.1.39:8000/api";
const BASE_URL = "https://chatbot-backend-murex-delta.vercel.app/api";

const ChatbotSupport = ({ route }) => {
  const { orderType, orderId, rating } = route.params;
  const [messages, setMessages] = useState(initialState[orderType]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [showFeedback, setShowFeedBack] = useState(false);
  const [showInputModal, setShowInputModal] = useState({
    type: "",
    value: false,
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);

  const scrollToEndRef = useRef(null);
  const selectedItem = useRef(null);

  useEffect(() => {
    async function getMessages() {
      if (rating) {
        const botMessage = {
          type: "bot",
          message: `you rated this conversation as ${rating}`,
        };
        const data = await getData();
        setMessages([...data, botMessage]);
        // console.log("localStorage Data", data);
      }
    }
    getMessages();
  }, []);

  useEffect(() => {
    async function fetchInitial() {
      setLoading(true);
      const BASE_URL = "http://192.168.54.108:8000/api";
      if (orderType === "placed") {
        const reponse = await fetch(`${BASE_URL}/orders_related`);
        const data = await reponse.json();
        console.log(data);
        const botMessage = {
          type: "bot",
          ...data,
        };
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
      }
    }

    // fetchInitial();
    // if (scrollToEndRef.current) {
    //   scrollToEndRef.current?.scrollTo({ animated: true });
    // }

    setTimeout(() => {
      scrollToEndRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.7,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      // console.log(result.assets[0]);
      // const formData = new FormData();
      // formData.append(
      //   "image",
      //   JSON.stringify({
      //     uri: fileUri,
      //     name: "damage.jpg",
      //     type: "image/jpeg",
      //   })
      // );
      setImageUrl(fileUri);
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          message: `${result.assets[0].fileName}`,
          imageUrl: fileUri,
        },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (showInputModal.type === "enter_wrong_item_name") {
      handleClickQuery({
        id: "wrong_item",
        name: value,
        category: "wrong_item",
        next_step: "upload_image",
      });
    } else if (showInputModal.type === "other_reasons") {
      handleClickQuery({
        id: "cancel_order",
        name: value,
        category: "cancel_order",
        next_step: "choose_cancel_type",
      });
    } else if (showInputModal.type === "add_new_item") {
      handleClickQuery({
        id: "modifying_order",
        name: value,
        category: "modifying_order",
        next_step: "add_new_item_confirmation",
      });
    } else if (showInputModal.type === "increase_quantity") {
      handleClickQuery({
        id: "add_quantity",
        name: messages[messages.length - 1].message,
        quantity: value,
        category: "modifying_order",
        next_step: "increase-quantity_of_existing_item_confirmation",
      });
    } else if (showInputModal.type === "other_issue") {
      handleClickQuery({
        id: "issue_with_delivery_partner",
        name: value,
        next_step: "confirm_report",
      });
    } else if (showInputModal.type === "enter_quantity") {
      handleClickQuery({
        id: "issue_with_quantity",
        name: value,
        next_step: "enter_received_quantity",
      });
    } else if (showInputModal.type === "customized_time_slot") {
      selectedSlot.current = value;
      handleClickQuery({
        id:
          orderType === "replaced" ? "replacement_queries" : "reschedule_order",
        name: value,
        next_step:
          orderType === "replaced"
            ? "reschedule_pickup_slot"
            : "choose_new_slot",
      });
    } else {
      const userQuery = {
        type: "user",
        message: value,
      };

      setMessages((prev) => [...prev, userQuery]);

      const botMessage = {
        type: "bot",
        message:
          "Thank you for sharing your valuable feedback with us. We will take this up with our internal teams for you. Thank you for choosing zippy!",
      };

      await delay(300);
      setMessages((prev) => [...prev, botMessage]);
    }

    setShowInputModal({
      value: false,
      type: "",
    });
    // await delay(3000);
    // setValue("");
  };

  const handleReplacementQueries = async (option) => {
    // if (option.id === "customized_time_slot") {
    //   setShowInputModal({
    //     value: true,
    //     type: "customized_time_slot",
    //   });
    //   return;
    // }
    const response = await fetch(`${BASE_URL}/replacement_queries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_step: option.next_step || option.id,
        orderId,
        issue_type: option.id,
        selectedSlot: option.name,
        confirm: option.id,
      }),
    });
    const data = await response.json();

    const botMessage = {
      type: "bot",
      ...data,
    };
    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
    return;
  };

  const handleClickQuery = async (option) => {
    // if (option.id === "show_available_offers") {
    //   router.push("/offerspage");
    //   return;
    // }

    if (
      option.id === "connect_delivery_partner" ||
      // option.id === "request_callback" ||
      option.id === "contact_support"
    ) {
      await Linking.openURL("tel:+9988776655");
      return;
    }

    if (
      option.id === "other_issue" ||
      option.id === "upload_image" ||
      option.id === "add_quantity"
    ) {
      await delay(100);
      setLoading(true);
    } else {
      const userQuery = {
        type: "user",
        message: option.name,
      };
      setMessages((prev) => [
        ...prev.map((msg) => ({
          type: msg.type,
          message: msg.message,
          imageUrl: msg.imageUrl,
          options: [],
        })),
        userQuery,
      ]);
      await delay(300);
      setLoading(true);
    }

    // Check for end conversation
    if (option.id === "end_conversation") {
      const botMessage = {
        type: "bot",
        message: "This conversation has been ended",
        options: [],
      };
      await delay(300);
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      await delay(500);
      setShowFeedBack(true);
      // const value = messages.map((msg) => ({
      //   type: msg.type,
      //   message: msg.message,
      //   imageUrl: msg.imageUrl,
      //   options: [],
      // }));

      await storeData([...messages, botMessage]);
      return;
    }

    if (option.id === "main_menu") {
      await delay(500);

      setMessages((prev) => [...prev, ...initialState[orderType]]);

      setLoading(false);
      return;
    }

    if (
      option.id === "replacement_queries" ||
      option.category === "replacement_queries"
    ) {
      handleReplacementQueries(option);
      setValue("");
      return;
    }

    if (
      option.id === "reschedule_pickup" ||
      option.category === "reschedule_pickup"
    ) {
      if (option.id === "customized_time_slot") {
        setShowInputModal({
          value: true,
          type: "customized_time_slot",
        });
        return;
      }
      const response = await fetch(`${BASE_URL}/reschedule_pickup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_step: option.next_step || "select_time_slot",
          orderId,
          selectedSlot: selectedSlot.current || option.id,
        }),
      });
      const data = await response.json();
      const botMessage = {
        type: "bot",
        ...data,
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      setValue("");
      return;
    }

    if (
      option.id === "issue_with_quantity" ||
      option.category === "issue_with_quantity"
    ) {
      if (option.next_step === "select_item_with_issue") {
        selectedItem.current = option.name;
      }
      if (option.id === "enter_quantity") {
        setShowInputModal({
          value: true,
          type: "enter_quantity",
        });
        setLoading(false);
        return;
      }
      const response = await fetch(`${BASE_URL}/issue_with_quantity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_step: option.next_step || "select_order",
          orderId: orderId,
          item_with_issue: selectedItem.current || option.id,
          resolution_choice: option.id,
          confirm_report: option.id,
          received_quantity: value,
        }),
      });

      const data = await response.json();

      const botMessage = {
        type: "bot",
        ...data,
      };
      await delay(500);
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      setValue("");
      return;
    }

    if (option.id === "missing_item" || option.category === "missing_item") {
      const response = await fetch(`${BASE_URL}/missing_item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_step: option.next_step || "select_order",
          orderId: orderId,
          missing_items: selectedItems.map((item) => item.name),
          resolution_choice: option.id,
          confirm_report: option.id,
        }),
      });

      const data = await response.json();

      const botMessage = {
        type: "bot",
        ...data,
      };
      await delay(1000);
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      setValue("");
      setSelectedItems([]);
      return;
    }
    // console.log("option", option);

    if (
      option.id === "issue_with_delivery_partner" ||
      option.category === "issue_with_delivery_partner"
    ) {
      if (option.id === "other_issue") {
        setShowInputModal({
          value: true,
          type: "other_issue",
        });
        setLoading(false);
        return;
      }
      const response = await fetch(`${BASE_URL}/issue_with_delivery_partner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_step: option.next_step || "select_order",
          orderId: orderId,
          selected_issue: option.id,
        }),
      });

      const data = await response.json();

      const botMessage = {
        type: "bot",
        ...data,
      };
      await delay(500);
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      setValue("");
      return;
    }

    if (
      option.id === "reschedule_order" ||
      option.category === "reschedule_order"
    ) {
      console.log("reschedule_order", option);
      if (option.id === "Customized time slot") {
        setShowInputModal({
          value: true,
          type: "customized_time_slot",
        });
        setLoading(false);
        return;
      }
      if (
        option.next_step === "choose_new_slot" ||
        option.id === "choose_new_slot"
      ) {
        selectedSlot.current = option.name;
      }
      const response = await fetch(`${BASE_URL}/reschedule_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_step: option.next_step || "select_order_to_reschedule",
          orderId: orderId,
          selected_slot:
            option.id === "choose_again" ? option.id : selectedSlot.current,
        }),
      });

      const data = await response.json();

      const botMessage = {
        type: "bot",
        ...data,
      };
      await delay(1000);
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      return;
    }

    if (option.id === "order_delayed" || option.category === "order_delayed") {
      const response = await fetch(`${BASE_URL}/order_delayed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // current_step: option.next_step || "select_delayed_order",
          current_step: option.next_step || "check_order_delay",
          orderId: orderId,
          user_choice: option.id,
        }),
      });

      const data = await response.json();

      const botMessage = {
        type: "bot",
        ...data,
      };
      await delay(500);
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      setValue("");
      return;
    }

    if (
      option.id === "modifying_order" ||
      option.category === "modifying_order"
    ) {
      if (option.input) {
        console.log("option input");
        selectedItem.current = option.name;
        setShowInputModal({
          value: true,
          type: "increase_quantity",
        });
        setLoading(false);
        return;
      }

      if (option.id === "other_reasons") {
        setShowInputModal({
          type: "other_reasons",
          value: true,
        });

        setLoading(false);
        return;
      }

      if (option.id === "add_new_item") {
        setShowInputModal({
          value: true,
          type: "add_new_item",
        });
        setLoading(false);
        return;
      }

      console.log("modifying_order", option);

      try {
        const response = await fetch(`${BASE_URL}/modifying_order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_step: option.next_step || "show_options",
            orderId: orderId,
            selectedItem: option.name || selectedItem.current,
            newAddedItem: option.name,
            quantity: option.quantity,
          }),
        });
        const data = await response.json();
        const botMessage = {
          type: "bot",
          ...data,
        };
        console.log("modifying_order_data", data);
        await delay(500);
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
        return;
      } catch (error) {
        console.log("modifying_order", error);
      } finally {
        setLoading(false);
        setValue("");
        return;
      }
    }

    if (option.id === "cancel_order" || option.category === "cancel_order") {
      if (option.id === "other_reasons") {
        setShowInputModal({
          type: "other_reasons",
          value: true,
        });

        setLoading(false);
        return;
      }
      // console.log("cancel_order", option);
      try {
        const response = await fetch(`${BASE_URL}/cancel_order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_step: option.next_step || "show_reasons",
            orderId: orderId,
            selected_item: option.name,
            refund_mode: option.id,
          }),
        });
        const data = await response.json();
        const botMessage = {
          type: "bot",
          ...data,
        };
        await delay(500);
        setMessages((prev) => [...prev, botMessage]);

        return;
      } catch (error) {
        console.log("cancel_order", error);
      } finally {
        setLoading(false);
        setValue("");
        setSelectedItems([]);
        return;
      }
    }

    if (option.id === "damaged_item" || option.category === "damaged_item") {
      console.log("damaged_item", option);
      if (option.id === "upload_image") {
        handleUpload();
        await delay(3000);
      }
      try {
        const response = await fetch(`${BASE_URL}/damaged_item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_step: option.next_step || "show_items",
            orderId: orderId || option.id,
            selected_item: option.name,
          }),
        });
        const data = await response.json();
        const botMessage = {
          type: "bot",
          ...data,
        };
        await delay(500);
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
        return;
      } catch (error) {
        console.log("damaged_item error", error);
      } finally {
        setLoading(false);
        setValue("");
      }
    }

    if (option.id === "wrong_item" || option.category === "wrong_item") {
      if (option.id === "enter_wrong_item_name") {
        await delay(300);
        setShowInputModal({
          value: true,
          type: "enter_wrong_item_name",
        });
        setLoading(false);
        return;
      }
      if (option.id === "upload_image") {
        handleUpload();
        await delay(3000);
      }
      try {
        const response = await fetch(`${BASE_URL}/wrong_item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_step: option.next_step || "show_items",
            orderId: orderId || option.id,
          }),
        });
        const data = await response.json();
        const botMessage = {
          type: "bot",
          ...data,
        };

        await delay(500);
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
        return;
      } catch (error) {
        console.log("error in wrong_item", error);
      } finally {
        setLoading(false);
        setValue("");
        return;
      }
    }

    if (option.id === "product_not_available") {
      await delay(300);
      setShowInputModal({
        value: true,
        type: "product_not_available",
      });
      setLoading(false);
      return;
    }

    let url;

    if (option.category) {
      url = `${BASE_URL}/${option.category}/${option.id}`;
    } else {
      url = `${BASE_URL}/${option.id}`;
    }

    const response = await fetch(`${url}`);
    const data = await response.json();

    const botResponse = {
      type: "bot",
      ...data,
    };

    await delay(500);
    setMessages((prev) => [...prev, botResponse]);
    setLoading(false);
  };

  const renderItem = ({ item, index }) => {
    const isBot = item.type === "bot";

    return isBot ? (
      <Bot
        key={index}
        response={item}
        handleClick={handleClickQuery}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    ) : (
      <User key={index} response={item} />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            marginTop: -40,
            backgroundColor: "white",
            // backgroundColor: "#98FF98",
            paddingVertical: 10,
            // paddingBottom: 120,
          }}
        >
          {/* chat messages */}

          <View style={{ flex: 1 }}>
            <FlatList
              ref={scrollToEndRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                gap: 20,
                paddingHorizontal: 10,
                paddingVertical: 10,
                paddingBottom: showFeedback ? 120 : 100,
              }}
              ListFooterComponent={loading ? <TypingIndicator /> : null}
            />
          </View>

          {showFeedback && (
            <FeedbackModal
              orderId={orderId}
              orderType={orderType}
              onRestartChat={() => setShowFeedBack(false)}
              style={{ backgroundColor: "black" }}
            />
          )}
        </View>

        {showInputModal.value && (
          <InputModal
            value={value}
            text={
              showInputModal.type === "increase_quantity"
                ? getInputText(showInputModal.type, selectedItem.current)
                : getInputText(showInputModal.type)
            }
            setValue={setValue}
            onClose={() =>
              setShowInputModal({
                value: false,
                type: "",
              })
            }
            handleSubmit={handleSubmit}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    gap: 10,
    paddingHorizontal: 10,
  },
});

export default ChatbotSupport;
