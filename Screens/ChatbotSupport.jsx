import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Linking,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Bot from "../Components/Bot";
import User from "../Components/User";
import TypingIndicator from "../Components/TypingIndicator";
import { delay, getInputText } from "../lib/utils";
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
          id: "cancel_order",
          name: "Cancel Order",
          category: "cancel_order",
        },

        {
          id: "modifying_order",
          name: "Modifying Order",
          category: "orders_related",
        },
        {
          id: "reschedule_order",
          name: "Reschedule Order",
          category: "orders_related",
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
          name: "Issue with products",
        },
        {
          id: "issue_with_delivery_partner",
          name: "Issue with delivery partner",
        },
      ],
    },
  ],
};

const ChatbotSupport = ({ route }) => {
  const { orderType, orderId } = route.params;
  console.log(orderType, orderId);

  const [messages, setMessages] = useState(initialState[orderType]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [showFeedback, setShowFeedBack] = useState(false);
  const [showInputModal, setShowInputModal] = useState({
    value: false,
    type: "product_not_available",
  });

  const selectedSlot = useRef(null);

  const flatListRef = useRef(null);

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

    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.7,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      console.log(result.assets[0]);
      const formData = new FormData();
      formData.append(
        "image",
        JSON.stringify({
          uri: fileUri,
          name: "damage.jpg",
          type: "image/jpeg",
        })
      );
      // setUploadImage(fileUri);
      setMessages((prev) => [
        ...prev,
        { type: "user", message: `${result.assets[0].fileName}` },
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
        next_step: "order_cancel_confirmation",
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
        id: "modifying_order",
        name: messages[messages.length - 1].message,
        quantity: value,
        category: "modifying_order",
        next_step: "increase-quantity_of_existing_item_confirmation",
      });
    } else if (showInputModal.type === "other_issue") {
      handleClickQuery({
        id: "issue_with_delivery_partner",
        name: value,
        next_step: "collect_description",
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

  const handleClickQuery = async (option) => {
    // home
    // const BASE_URL = "http://10.223.171.9:8000/api";
    // work
    // const BASE_URL = "http://192.168.1.19:8000/api";
    const BASE_URL = "https://chatbot-backend-murex-delta.vercel.app/api";

    // if (option.id === "show_available_offers") {
    //   router.push("/offerspage");
    //   return;
    // }

    if (
      option.id === "connect_delivery_partner" ||
      option.id === "request_callback" ||
      option.id === "contact_support"
    ) {
      await Linking.openURL("tel:+9988776655");
      return;
    }

    const userQuery = {
      type: "user",
      message: option.name,
    };

    setMessages((prev) => [...prev, userQuery]);
    await delay(300);
    setLoading(true);

    // Check for end conversation
    if (option.id === "end_conversation") {
      const botMessage = {
        type: "bot",
        message: "This conversation has been ended",
      };
      await delay(300);
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      await delay(500);
      setShowFeedBack(true);

      return;
    }

    if (option.id === "main_menu") {
      await delay(500);

      setMessages((prev) => [...prev, prev[0]]);
      setLoading(false);
      return;
    }

    // console.log("option", option);
    if (option.id === "missing_item" || option.category === "missing_item") {
      const response = await fetch(`${BASE_URL}/missing_item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_step: option.next_step || "select_order",
          orderId: orderId,
          missing_items: [option.id],
          resolution_choice: option.id,
          confirm_report: option.id,
        }),
      });

      const data = await response.json();

      const botMessage = {
        type: "bot",
        ...data,
      };
      // await delay(1000);
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }

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
      await delay(1000);
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      return;
    }

    if (
      option.id === "reschedule_order" ||
      option.category === "reschedule_order"
    ) {
      if (option.id.includes("Today") || option.id === "choose_new_slot") {
        selectedSlot.current = option.id;
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
          current_step: option.next_step || "select_delayed_order",
          orderId: orderId,
          user_choice: option.id,
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

    if (
      option.id === "modifying_order" ||
      option.category === "modifying_order"
    ) {
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

      if (option.id === "increase_quantity") {
        setShowInputModal({
          value: true,
          type: `increase_quantity`,
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/modifying_order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_step: option.next_step || "show_options",
            orderId: orderId,
            selectedItem: option.name,
            newAddedItem: option.name,
            quantity: option.quantity,
          }),
        });
        const data = await response.json();
        const botMessage = {
          type: "bot",
          ...data,
        };
        await delay(3000);
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
        return;
      } catch (error) {}
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
      try {
        const response = await fetch(`${BASE_URL}/cancel_order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_step: option.next_step || "show_active_orders",
            orderId: orderId,
            selected_item: option.name,
          }),
        });
        const data = await response.json();
        const botMessage = {
          type: "bot",
          ...data,
        };
        await delay(3000);
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
        return;
      } catch (error) {}
    }
    if (option.id === "damaged_item" || option.category === "damaged_item") {
      console.log("damaged_item", option);
      if (option.id === "upload_image") {
        handleUpload();
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
      } catch (error) {}
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
        await delay(1000);
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
        return;
      } catch (error) {}
    }

    // if (option.id === "cancel_order") {
    //   console.log("cancel_order", option);
    //   const res = await fetch(`${BASE_URL}/orders/active`);
    //   const orders = await res.json();

    //   // Show orders as clickable buttons
    //   const orderOptions = orders.map((order) => ({
    //     id: order.id,
    //     name: `${order.id} - ${order.items.join(", ")}`,
    //     category: "cancel_order",
    //   }));

    //   const botMessage = {
    //     type: "bot",
    //     message: "Please select the order you want to cancel",
    //     options: orderOptions,
    //   };
    //   // await delay(300);
    //   // setLoading(true);
    //   await delay(300);
    //   setMessages((prev) => [...prev, botMessage]);
    //   setLoading(false);
    //   return;
    // }

    // if (option.id.startsWith("OD") && option.category === "cancel_order") {
    //   const botMessage = {
    //     type: "bot",
    //     message: `Are you sure you want to cancel?`,
    //     options: [
    //       {
    //         id: "yes",
    //         name: "Yes",
    //         category: option.id,
    //       },
    //       {
    //         id: "no",
    //         name: "No",
    //         category: option.id,
    //       },
    //     ],
    //   };

    //   await delay(3000);
    //   setMessages((prev) => [...prev, botMessage]);
    //   setLoading(false);
    //   return;
    // }

    // if (option.id === "yes") {
    //   // Step 1: Ask for reason before cancelling
    //   const botMessage = {
    //     type: "bot",
    //     message: "Please tell us why you’d like to cancel your order.",
    //     options: [
    //       { id: "reason_wrong_item", name: "Ordered the wrong item" },
    //       { id: "reason_delayed", name: "Delivery taking too long" },
    //       { id: "reason_changed_mind", name: "Changed my mind" },
    //       { id: "reason_other", name: "Other reasons" },
    //     ],
    //   };

    //   await delay(800);
    //   setMessages((prev) => [...prev, botMessage]);
    //   setLoading(false);
    //   return;
    // }

    // if (
    //   option.id === "reason_wrong_item" ||
    //   option.id === "reason_delayed" ||
    //   option.id === "reason_changed_mind" ||
    //   option.id === "reason_other"
    // ) {
    //   let message;

    //   switch (option.id) {
    //     case "reason_wrong_item":
    //       message = "Got it. You ordered the wrong item.";
    //       break;
    //     case "reason_delayed":
    //       message = "Got it. The delivery is delayed.";
    //       break;
    //     case "reason_changed_mind":
    //       message = "Understood. You changed your mind.";
    //       break;
    //     default:
    //       message = "Thank you for sharing.";
    //   }

    //   // const botMessage1: MessagesType = {
    //   //   type: "bot",
    //   //   message: `${message} We’re processing your cancellation request...`,
    //   // };

    //   await delay(1000);

    //   const botMessage2 = {
    //     type: "bot",
    //     message:
    //       "✅ Your order has been successfully cancelled. The refund will be processed within 3–5 business days.",
    //   };

    //   // setMessages((prev) => [...prev, botMessage1]);
    //   await delay(1500);
    //   setMessages((prev) => [...prev, botMessage2]);
    //   setLoading(false);
    //   return;
    // }

    // if (option.id === "yes") {
    //   // await delay(300);
    //   // setLoading(true);
    //   let botMessage: MessagesType;
    //   if (option.category === "OD1234") {
    //     botMessage = {
    //       type: "bot",
    //       message: `✅ order ${option.category} has been successfully cancelled. The refund will be processed within 3–5 business days.`,
    //     };
    //   } else {
    //     botMessage = {
    //       type: "bot",
    //       message: `Your order ${option.category} can't be cancelled. But you can return your order once delivered.`,
    //     };
    //   }

    //   await delay(3000);
    //   setMessages((prev) => [...prev, botMessage]);
    //   setLoading(false);
    //   return;
    // }

    // if (option.id === "no") {
    //   const botMessage = {
    //     type: "bot",
    //     message: "No problem. Your order will continue as scheduled.",
    //   };
    //   await delay(3000);
    //   setMessages((prev) => [...prev, botMessage]);
    //   setLoading(false);
    //   return;
    // }

    if (option.id === "product_not_available") {
      await delay(300);
      setShowInputModal({
        value: true,
        type: "product_not_available",
      });
      setLoading(false);
      return;
    }

    await delay(3000);

    let url;

    if (option.category) {
      url = `${BASE_URL}/${option.category}/${option.id}`;
    } else {
      url = `${BASE_URL}/${option.id}`;
    }

    const response = await fetch(`${url}`);
    const data = await response.json();
    console.log(url);
    const botResponse = {
      type: "bot",
      ...data,
    };

    setMessages((prev) => [...prev, botResponse]);
    setLoading(false);
  };

  const renderItem = ({ item, index }) => {
    const isBot = item.type === "bot";

    return isBot ? (
      <Bot key={index} response={item} handleClick={handleClickQuery} />
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
        {/* <View style={styles.header}>
          <MaterialCommunityIcons name="arrow-left" size={18} />

          <Text>Okal Support</Text>
        </View> */}

        <View
          style={{
            flex: 1,
          }}
        >
          {/* chat messages */}

          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                gap: 20,
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
              style={{
                paddingBottom: 50,
              }}
              ListFooterComponent={loading ? <TypingIndicator /> : null}
            />
            {/* {uploadImage && (
              <Image
                source={{ uri: uploadImage }}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
            )} */}
          </View>

          {/* input */}
          {/* <View
            style={{
              height: 80,
              backgroundColor: "white",
              justifyContent: "center",
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <TextInput
              placeholder="Type your query here."
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 100,
              }}
            />
            <View
              style={{
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 100,
              }}
            >
              <Ionicons name="send" size={20} />
            </View>
          </View> */}
          {showFeedback && (
            <FeedbackModal onRestartChat={() => setShowFeedBack(false)} />
          )}
        </View>

        {showInputModal.value && (
          <InputModal
            value={value}
            text={getInputText(showInputModal.type) || ""}
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
