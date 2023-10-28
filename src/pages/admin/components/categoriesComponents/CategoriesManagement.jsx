import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Button, Space, Input, Modal } from "antd";
import { loadCategories } from "../../../../helpers/axios_helper";
import axios from "axios";
import SearchComponents from "../SearchComponent";

import ViewCategory from "./ViewCategory";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";

function CategoriesManagement() {
  const [categories, setCategories] = useState([]);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [searchResults, setSearchResults] = useState([]);

  const performSearch = (searchTerm) => {
    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredCategories);
  };

  const { id } = useParams();

  useEffect(() => {
    loadCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, [isDeleteModalVisible, isEditModalVisible]);

  const columns = [
    {
      title: "STT",
      dataIndex: "rowNumber",
      key: "rowNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Enable",
      dataIndex: "enable",
      key: "enable",
      render: (enable) => (
        <span style={{ color: enable ? "green" : "red" }}>
          {enable ? "enable" : "Disable"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button 
          type="primary"
          onClick={() => handleEditClick(record)}
          >Edit
         
          </Button>

          <Button
            className="ant-btn-danger"
            onClick={() => handleDeleteClick(record)}
          >
            Delete
          </Button>

          <Button 
          onClick={() => handleViewClick(record)}

          >
          View</Button>
        </Space>
      ),
    },
  ];

  const handleDeleteClick = (record) => {
    setSelectedCategoryId(record.id);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    axios
      .delete(`/api/categories/${selectedCategoryId}`)
      .then((response) => {
        console.log(`Category with ID ${id} Deleted successfully `);
        setIsDeleteModalVisible(false);
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
        setIsDeleteModalVisible(false);
      });
    // console.log(selectedUserId);
  };

  const handleViewClick = (record) => {
    setSelectedCategoryId(record.id);
    setIsViewModalVisible(true);
    
  };

  const handleEditClick = (record) => {
    setSelectedCategoryId(record.id);
    setIsEditModalVisible(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalVisible(true);
  };


  return (
    <>
      <div
        style={{
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 5,
          marginRight: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchComponents onSearch={performSearch} />
        <Button type="primary"
        onClick={() => handleCreateClick()}
        > Add new category
          
        </Button>
      </div>

      <hr />
      <Table
        columns={columns}
        dataSource={searchResults.length > 0 ? searchResults : categories}
      />
      <Modal
        title={"Confirm Deleting"}
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      >
        Are you sure you want to {"delete"} this category?
      </Modal>
      <Modal
        title="View category"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedCategoryId && (
          <ViewCategory selectedCategoryId={selectedCategoryId}/>

        )}
      </Modal>
      <Modal
        title="Edit category"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsEditModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedCategoryId && (
          <EditCategory selectedCategoryId={selectedCategoryId}/>

        )}
      </Modal>
      <Modal
        title="Add new category"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsCreateModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {
          <AddCategory />

        }
      </Modal>
    </>
  );
}

export default CategoriesManagement;
