import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Button, Space, Input, Modal, Select } from "antd";
import { loadCategories } from "../../../../helpers/axios_helper";
import axios from "axios";
import SearchComponents from "../SearchComponent";

import ViewCategory from "./ViewCategory";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import { ToastContainer } from "react-toastify";

function CategoriesManagement() {
  const [categories, setCategories] = useState([]);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [filterOption, setFilterOption] = useState(null);
  const [selectedEnable, setSelectedEnable] = useState(null);
  const [showNoResults, setShowNoResults] = useState(false);

  const performSearch = (searchTerm) => {
    let filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by enable status if an option is selected
    if (filterOption !== null) {
      filteredCategories = filteredCategories.filter(
        (category) => category.enable === filterOption
      );
    }

    setSearchResults(filteredCategories);
  };

  const handleFilter = () => {
    if (selectedEnable !== null) {
      const filteredCategories = categories.filter(
        (category) => category.enable === selectedEnable
      );
      setSearchResults(filteredCategories);
      setShowNoResults(filteredCategories.length === 0);
    } else {
      setSearchResults(categories);
      setShowNoResults(false);
    }
  };
  const handleEnableChange = (value) => {
    setSelectedEnable(value);
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
      title: "Tên nhóm ngành, nghề",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "enable",
      key: "enable",
      render: (enable) => (
        <span style={{ color: enable ? "green" : "red" }}>
          {enable ? "Đang hoạt động" : "Ngừng hoạt động"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditClick(record)}>
            Edit
          </Button>

          <Button
            className="ant-btn-danger"
            onClick={() => handleDeleteClick(record)}
          >
            Delete
          </Button>

          <Button onClick={() => handleViewClick(record)}>View</Button>
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
      {" "}
      <ToastContainer />
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

        <div>
          <Select
            style={{
              width: 200,
              marginRight: 10,
              border: "0.5px solid grey",
              borderRadius: "5px",
            }}
            placeholder="Lọc theo trạng thái enable"
            onChange={handleEnableChange}
          >
            <Select.Option value={null}>Tất cả</Select.Option>
            <Select.Option value={1}>Hoạt động</Select.Option>
            <Select.Option value={0}>Ngừng hoạt động</Select.Option>
          </Select>
          <Button type="primary" onClick={handleFilter}>
            Lọc
          </Button>
        </div>

        <Button type="primary" onClick={() => handleCreateClick()}>
          {" "}
          Thêm nhóm ngành, nghề
        </Button>
      </div>
      <hr />
      <Table
        columns={columns}
        dataSource={
          showNoResults
            ? []
            : searchResults.length > 0
            ? searchResults
            : categories
        }
        locale={{
          emptyText: showNoResults ? "Không có kết quả" : "Không có dữ liệu",
        }}
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
        title="Nhóm ngành, nghề"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              key="back"
              onClick={() => setIsViewModalVisible(false)}
              style={{ textAlign: "left" }}
            >
              Close
            </Button>
            ,
          </div>,
        ]}
      >
        {selectedCategoryId && (
          <ViewCategory selectedCategoryId={selectedCategoryId} />
        )}
      </Modal>
      <Modal
        title="Edit category"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button key="back" onClick={() => setIsEditModalVisible(false)}>
              Close
            </Button>
            ,
          </div>,
        ]}
      >
        {selectedCategoryId && (
          <EditCategory selectedCategoryId={selectedCategoryId} />
        )}
      </Modal>
      <Modal
        title="Thêm nhóm ngành, nghề"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={[
          <div
            key="custom-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button onClick={() => setIsCreateModalVisible(false)}>
              Close
            </Button>
          </div>,
        ]}
      >
        {<AddCategory />}
      </Modal>
    </>
  );
}

export default CategoriesManagement;
