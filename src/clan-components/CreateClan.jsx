import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAppContext } from "../Context";
import { toast } from "react-toastify";

const CreateClan = ({ showCreate: show, setShowCreate: setShow }) => {
  const handleClose = () => setShow(false);
  const { getData, setHasClan } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [clanValues, setClanValues] = useState({
    name: "",
    max: 1,
    min: 1,
    type: "open",
  });
  const handleChange = (e, el) => {
    setClanValues({ ...clanValues, [el]: e.target.value });
  };
  const CreateClan = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const resp = await axios.post(
        "http://localhost:5000/api/v1/createClan",
        {
          name: clanValues.name,
          max: clanValues.max,
          min: clanValues.min,
          type: clanValues.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      setShow(false);
      getData();
      console.log(resp);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.msg);
      console.log(error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Clan</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "200px" }}>
          <div className="col-12 border border-black py-1 my-1">
            Clan name :{" "}
            <input
              type="text"
              value={clanValues.name}
              onChange={(e) => {
                handleChange(e, "name");
              }}
            />
          </div>
          <div className="col-12 border border-black py-1 my-1">
            Max members :{" "}
            <input
              type="number"
              min={1}
              max={10}
              value={clanValues.max}
              onChange={(e) => handleChange(e, "max")}
            />
          </div>
          <div className="col-12 border border-black py-1 my-1">
            Min wins to join :{" "}
            <input
              type="number"
              value={clanValues.min}
              min={0}
              max={100}
              onChange={(e) => handleChange(e, "min")}
            />
          </div>
          <div className="col-12 border border-black py-1 my-1">
            Clan type :{" "}
            <select
              onChange={(e) => handleChange(e, "type")}
              value={clanValues.type}
            >
              <option value="open">open to join</option>
              <option value="req">ask to join</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={CreateClan} disabled={isLoading}>
            Create Clan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateClan;
