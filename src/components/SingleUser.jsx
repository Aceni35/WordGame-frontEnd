import React, { useEffect, useState } from "react";
import { useAppContext } from "../Context";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const SingleUser = ({ showSingle, setShowSingle, user }) => {
  const hideModal = () => setShowSingle(false);
  const [userDetails, setUserDetails] = useState({});
  const [userLoading, setUserLoading] = useState(false);
  const { userSocket } = useAppContext();

  const getUser = async () => {
    setUserLoading(true);
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/getSingleUser?search=${user}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      setUserDetails({ ...res.data, hasSent: false, isLoading: false });
      setUserLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, [user]);
  return (
    <Modal
      show={showSingle}
      backdrop="static"
      onHide={hideModal}
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>Friend Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!userLoading ? (
          <div className="row">
            <div className="col-12 fs-4">Username : {userDetails.username}</div>
            <div className="col-12 text-success">Wins : {userDetails.wins}</div>
            <div className="col-12 text-danger">
              Losses : {userDetails.losses}
            </div>
            <div className="col-12 text-info">
              Record : {userDetails.won} W/
              {userDetails.lost} L
            </div>
            <div className="col-12 text-danger">
              Average guess : {userDetails.avgGuess}
            </div>
            <div className="col-12 text-info">Since : {userDetails.since}</div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12 text-center">
              <Spinner />
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={userDetails.hasSent ? "danger" : "primary"}
          disabled={userDetails.isLoading}
          onClick={() => {
            if (userDetails.hasSent === true) {
              const changeLoading = () => {
                setUserDetails({
                  ...userDetails,
                  hasSent: false,
                  isLoading: false,
                });
              };
              setUserDetails({
                ...userDetails,
                isLoading: true,
                hasSent: true,
              });
              userSocket.emit(
                "cancel-challenge",
                userDetails.username,
                changeLoading
              );
            } else if (userDetails.hasSent === false) {
              setUserDetails({
                ...userDetails,
                hasSent: true,
                isLoading: true,
              });
              const changeLoading = () => {
                setUserDetails({
                  ...userDetails,
                  isLoading: false,
                  hasSent: true,
                });
              };
              userSocket.emit(
                "send-challenge",
                userDetails.username,
                changeLoading
              );
            }
          }}
        >
          {userDetails.hasSent ? <>Cancel</> : <>Challenge</>}
        </Button>
        <Button
          variant="secondary"
          onClick={hideModal}
          disabled={userDetails.hasSent}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SingleUser;
