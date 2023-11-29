import React, { useEffect, useState } from "react";

import { useAuth } from "../../../contexts/AuthContext";
import { request, loadUserByUsername } from "../../../helpers/axios_helper";
import { Descriptions, Input } from "antd";

export default function SendMessage() {
  const { username } = useAuth();
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [user, setUser] = useState({
    id: "",
  });

  useEffect(() => {
    loadUserByUsername(username)
      .then((data) => {
        setUser(data.id);
        console.log(data.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }, [username]);
  return (
    <div>
      <Descriptions column={1}>
        <Descriptions.Item
          label="Tiêu đề"
          labelStyle={{ color: "black" }}
          labelCol={{ span: 8 }}
        >
          <Input
            placeholder="Message Title"
            value={messageTitle}
            onChange={(e) => setMessageTitle(e.target.value)}
          />
        </Descriptions.Item>
        <Descriptions.Item
          label="Nội dung"
          labelStyle={{ color: "black" }}
          labelCol={{ span: 8 }}
        >
          <Input.TextArea
            placeholder="Message Content"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
