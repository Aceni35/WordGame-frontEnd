import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAppContext } from "../Context";
import { toast } from "react-toastify";

const Edit = ({ showEdit: show, setShowEdit: setShow, mate: name }) => {
  const handleClose = () => setShow(false);
  const { userSocket, clanDetails, getData, setClanMessages } = useAppContext();
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit ClanMate?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You can promote this member to the new clan Owner or you can kick him
          out of the clan
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              const cb = (type, msg) => {
                if (type && msg) {
                  toast[type](msg);
                }
                if (type === "success") {
                  setClanMessages((prev) => {
                    return [
                      ...prev,
                      { from: "clan", msg: `${name} has been kicked` },
                    ];
                  });
                  getData();
                }
                handleClose();
              };
              userSocket.emit("kick-member", name, clanDetails.name, cb);
            }}
          >
            Kick
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const cb = (type, msg) => {
                toast[type](msg);
                handleClose();
                if (type === "success") {
                  getData();
                  setClanMessages((prev) => {
                    return [
                      ...prev,
                      { from: "clan", msg: `${name} is the new clan owner` },
                    ];
                  });
                }
              };
              userSocket.emit("promote-member", name, clanDetails.name, cb);
            }}
          >
            Promote
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Edit;
