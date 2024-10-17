import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SearchFliters from "./SearchFliters";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useAppContext } from "../Context";
import { toast } from "react-toastify";

const SearchModal = ({ showSearch: show, setShowSearch: setShow }) => {
  const handleClose = () => setShow(false);
  const [useFilters, setUseFilters] = useState(false);
  const [filters, setFilters] = useState({
    min: 1,
    max: 1,
    gw: 1,
    type: "open",
  });
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { clanDetails, userSocket, wins, getData, setHasClan } =
    useAppContext();

  const searchClan = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = "";
      if (!useFilters) {
        url = `http://localhost:5000/api/v1/searchClan?name=${search}&filters=off`;
      } else {
        const { min, max, gw, type } = filters;
        url = `http://localhost:5000/api/v1/searchClan?name=${search}&filters=on&min=${min}&max=${max}&gw=${gw}&type=${type}&cname=${clanDetails.name}`;
      }
      const resp = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let newClans = resp.data.clans.filter((x) => {
        if (x.name != clanDetails.name) {
          return x;
        }
      });
      setResult(newClans);
      setDisplay(true);
      setShowFilters(false);
      setSearch("");
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="ms-3">Enter Clan name</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "290px" }}>
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => {
                  setShowFilters(!showFilters);
                }}
              >
                Filters
              </button>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn btn-light border border-dark ms-2"
                onClick={searchClan}
              >
                <FaSearch />
              </button>
              <hr className="my-1" />
            </div>
            {showFilters ? (
              <SearchFliters
                useFilters={useFilters}
                setUseFilters={setUseFilters}
                filters={filters}
                setFilters={setFilters}
              />
            ) : (
              <>
                {display &&
                  result.length > 0 &&
                  result.map((clan, index) => {
                    if (clan.name != clanDetails.name) {
                      return (
                        <div
                          className="row border border-dark p-1 my-1 rounded bg-light"
                          key={index}
                        >
                          <div className="col-10 d-flex align-items-center">
                            <span className="ms-2">{clan.name}</span>
                          </div>
                          <div className="col-2">
                            <button
                              className="btn btn-outline-success p-0"
                              style={{ width: "60px" }}
                              disabled={isLoading}
                              onClick={() => {
                                setIsLoading(true);
                                const cb = async (type, msg) => {
                                  if (type || msg) {
                                    toast[type](msg);
                                    setIsLoading(false);
                                    return;
                                  }

                                  await getData();
                                  setShow(false);
                                  setHasClan(true);
                                };
                                userSocket.emit("join-clan", clan.name, cb);
                              }}
                            >
                              Join
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                {display && result.length === 0 && (
                  <div className="row ">
                    <div className="col-12 text-center">No clans found</div>
                  </div>
                )}
              </>
            )}
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

export default SearchModal;
