import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAppContext } from "../Context";

const InfoModal = ({ showInfo: show, setShowInfo: setShow }) => {
  const handleClose = () => setShow(false);
  const { clanDetails } = useAppContext();

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Clan Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">Clan name : {clanDetails.name}</div>
            <div className="col-6">
              Clan owner : {clanDetails.clanOwner.usr_name}
            </div>
            <div className="col-6">Total games won : {clanDetails.clanWon}</div>
            <div className="col-6">
              Best player : {clanDetails.clanBest.usr_name}
            </div>
            <div className="col-6">
              Total members : {clanDetails.totalMembers}
            </div>
            <div className="col-6">Clan type : {clanDetails.clanType}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InfoModal;
