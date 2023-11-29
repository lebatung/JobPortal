import { SendOutlined, WechatOutlined } from "@ant-design/icons";
import { Button, Card, Input, Layout, List } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useInsertionEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  request,
  loadConversationByUserId,
  loadUserByUsername,
  loadPersonalDetailByUserId,
} from "../../../../helpers/axios_helper";

const MessagesManagement = () => {
  const { username } = useAuth();
  const [user, setUser] = useState({
    id: "",
  });
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [personalDetail, setPersonalDetail] = useState("");
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    // Đặt các tin nhắn của cuộc trò chuyện ở đây dựa vào conversation.id
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      const newMessage = {
        content: messageInput,
        userID: user.id,
        sentAt: new Date(),
      };
      if (!selectedConversation.messages) {
        selectedConversation.messages = [];
      }
      selectedConversation.messages.push(newMessage);
      setLastMessageTime(newMessage.sentAt);

      setSelectedConversation({ ...selectedConversation });

      setMessageInput("");
    }
    console.log(messages);
    const repliedDTO = {
      userId: user.id,
      messageContent: messageInput,
      conversationId: selectedConversation.id,
    };
    console.log("repliedDTO", repliedDTO);

    request("POST", `/api/messages/replied`, repliedDTO)
      .then((response) => {
        console.log("replied!:", response.data);
      })
      .catch((error) => {
        console.error("reply failed:", error);
      });
  };

  const conversationListStyle = {
    height: "auto",
  };
  // CSS cho conversation-item
  const conversationItemStyle = {
    cursor: "pointer",
    padding: "8px",
    borderBottom: "1px solid #e8e8e8",
    transition: "background-color 0.3s",
  };

  // CSS khi hover vào conversation-item
  const conversationItemHoverStyle = {
    backgroundColor: "#e8e8e8",
    // Thêm các kiểu CSS khác tùy theo yêu cầu của bạn
  };

  // CSS cho conversation-item khi được chọn
  const conversationItemSelectedStyle = {
    backgroundColor: "#2b4054", // Đổi màu theo ý muốn
    color: "white", // Đổi màu chữ khi được chọn
    borderRadius: "5px",
  };

  const layoutStyle = {
    height: "auto",
  };

  const messageListStyle = {
    maxHeight: "400px",
    overflowY: "auto",
  };

  const message = {
    borderRaridus: "10px",
    border: "none",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  };
  const messageInputStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "5px",
  };

  const messageInputContainerStyle = {
    marginTop: "auto",
    padding: "10px",
    bottom: 0,
    backgroundColor: "white",
    boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
  };

  const lastMessageTimeStyle = {
    display: "flex",
    justifyContent: "right",
    marginBottom: "10px",
  };

  const inputStyle = {
    flex: 1,
  };

  const buttonStyle = {
    alignSelf: "flex-end",
  };

  const messageStyle = {
    margin: "3px",
    padding: "10px",
    borderRadius: "5px",
  };

  const sentMessageStyle = {
    ...messageStyle,
    color: "white",
    backgroundColor: "#007bff",
    maxWidth: "45%",
    float: "right", // Căn lề tin nhắn của người gửi về bên phải
    clear: "both", // Đảm bảo không có phần tử khác xen vào
  };

  const receivedMessageStyle = {
    ...messageStyle,
    maxWidth: "45%",
    backgroundColor: "#f0f0f0",
    float: "left", // Căn lề tin nhắn của người nhận về bên trái
    clear: "both", // Đảm bảo không có phần tử khác xen vào
  };

  const messageContentStyle = {
    display: "inline-block", // Đặt display thành inline-block
    whiteSpace: "nowrap", // Đặt white-space thành nowrap
    overflow: "hidden", // Để tránh tràn bố cục
  };

  const messageSentAtStyle = {
    fontSize: "12px",
    color: "#777",
  };
  const avatarStyle = {
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    margin: "0 10px",
  };
  useEffect(() => {
    loadUserByUsername(username)
      .then((data) => {
        setUser(data);
        //console.log(user.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
    loadConversationByUserId(user.id)
      .then((data) => {
        setConversations(data);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }, [user.id, username]);
  useEffect(() => {
    if (selectedConversation) {
      // Lấy thông tin người nhận từ selectedConversation
      const recipientId = selectedConversation.messages[0].recipientId;
      console.log(
        "selectedConversation.messages[0].recipientId",
        selectedConversation.messages[0].userID
      );

      loadPersonalDetailByUserId(recipientId)
        .then((data) => {
          setPersonalDetail(data);
        })
        .catch((error) => {
          console.error("Error loading recipient information:", error);
        });
    }
  }, [selectedConversation]);



  return (
    <>
      <Layout style={layoutStyle}>
        <Sider width={250} style={{ backgroundColor: "#435e78" }}>
          <div style={conversationListStyle}>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                style={{
                  ...conversationItemStyle,
                  ...(selectedConversation?.id === conversation.id
                    ? conversationItemSelectedStyle
                    : {}),
                  borderRaridus: "5px",
                  border: "none",
                  margin: "5px 10px",
                  display: "flex",
                  justifyContent: "flex-start", // Đưa văn bản về bên trái
                  color: "white",
                }}
              >
                <WechatOutlined style={{ marginRight: "8px" }} />{" "}
                {conversation.name}
              </div>
            ))}
          </div>
        </Sider>
        <Content style={{ contentStyle }}>
          <div className="chat-box">
          <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              {personalDetail && (
                <>
                  <img
                    style={avatarStyle}
                    src={`http://localhost:8080/api/files/${personalDetail.avatar}`}
                    alt={personalDetail.name}
                  />
                  <h3>{personalDetail.name}</h3>
                </>
              )}
            </div>
            <div style={messageListStyle} className="message-list">
              {selectedConversation ? (
                selectedConversation.messages.map((message, index) => (
                  <div
                    key={index}
                    style={
                      message.userID === user.id
                        ? sentMessageStyle
                        : receivedMessageStyle
                    }
                  >
                    <div style={messageContentStyle}>{message.content}</div>
                    
                  </div>
                ))
              ) : (
                <div className="no-conversation">
                  Select a conversation to start chatting.
                </div>
              )}
            </div>
            <div style={lastMessageTimeStyle}>
              
              {lastMessageTime ? lastMessageTime.toLocaleTimeString() : ""}
            </div>
            <div className="message-input" style={messageInputContainerStyle}>
              <div className="message-input" style={messageInputStyle}>
                <Input
                  style={inputStyle}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button style={buttonStyle} onClick={handleSendMessage}>
                  <SendOutlined /> Send
                </Button>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default MessagesManagement;
