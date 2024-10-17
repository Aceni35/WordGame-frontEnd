import axios from "axios";
import React, { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { AiOutlineUserAdd } from "react-icons/ai";
import { TiTickOutline } from "react-icons/ti";
import { MdDoNotDisturb } from "react-icons/md";
import { useAppContext } from "../Context";
import { toast } from "react-toastify";
import SingleNot from "./SingleNot";

const Notifications = ({ showModal, setShowModal }) => {
  const hideModal = () => setShowModal(false);
  const { notifications } = useAppContext();
  return (
    <Modal
      show={showModal}
      backdrop="static"
      onHide={hideModal}
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>You have new notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "400px", overflowY: "scroll" }}>
        {notifications.map((not, index) => {
          return (
            <div className="row border border-dark my-1" key={index}>
              <SingleNot not={not} />
            </div>
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Notifications;
