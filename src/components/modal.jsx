import axios from "axios";
import React, { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useAppContext } from "../Context";
import { toast } from "react-toastify";

const modal = ({ showModal, setShowModal }) => {
  const [friendsList, setFriends] = useState([]);
  const [username, setUsername] = useState();
  const { userSocket, socketId } = useAppContext();

  const hideModal = () => setShowModal(false);
  const getFriends = async (search) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get(
        `http://localhost:5000/api/v1/searchUsers?search=${search}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setUsername(socketId);
      setFriends(resp.data.users);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      show={showModal}
      backdrop="static"
      onHide={hideModal}
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add new friends</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12 text-center">
            Search friends :{" "}
            <input
              type="text"
              onChange={(e) => {
                getFriends(e.target.value);
              }}
            />
          </div>
        </div>

        {friendsList.map((f) => {
          if (username === f.username) return;
          let friend = f.username;
          return (
            <div className="row border border-dark my-1" key={f._id}>
              <div className="col-9">{f.username}</div>
              <div
                className="col-3"
                onClick={() => {
                  const giveToast = (text) => {
                    toast.info(text);
                  };
                  console.log(friend);

                  userSocket.emit(
                    "add-friend",
                    { username, friend },
                    giveToast
                  );
                }}
              >
                Add
                <AiOutlineUserAdd size={25} />
              </div>
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

export default modal;
