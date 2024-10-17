import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAppContext } from "../Context";
import { toast } from "react-toastify";

const Modal2 = ({ show, setShow }) => {
  const handleClose = () => setShow(false);
  const {
    userSocket,
    clanDetails,
    setHasClan,
    setClanDetails,
    setClanMessages,
    socketId,
  } = useAppContext();

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Leave Clan?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to leave this clan</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              const cb = (type, message) => {
                toast[type](message);
                if (type === "success") {
                  setHasClan(false);
                  setClanDetails({});
                  setClanMessages([]);
                  handleClose();
                }
              };
              let clanName = clanDetails.name;
              userSocket.emit("leave-clan", clanName, cb);
            }}
          >
            Leave
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Modal2;
