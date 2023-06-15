import React, { useState } from "react";
import { Button, Modal, Table } from "antd";
const PaymentHistory = (props) => {
  const { payHistoryShow, handleClose } = props;

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
  ];

  return (
    <>
      <Modal
        title="PayMent History"
        open={payHistoryShow}
        onCancel={handleClose}
        footer={
          <Button type="primary" onClick={handleClose}>
            Ok
          </Button>
        }
      >
        <Table dataSource={dataSource} columns={columns} />;
      </Modal>
    </>
  );
};
export default PaymentHistory;
