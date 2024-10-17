import React, { useState } from "react";
import JoinedClan from "../clan-components/JoinedClan";
import { useAppContext } from "../Context";
import SearchModal from "../clan-components/SearchModal";
import { useNavigate } from "react-router-dom";
import CreateClan from "../clan-components/CreateClan";
import { toast } from "react-toastify";
const Clans = () => {
  const [show, setShow] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const handleShow = () => setShow(true);
  const { hasClan } = useAppContext();
  const navigate = useNavigate();

  return (
    <>
      <CreateClan setShowCreate={setShowCreate} showCreate={showCreate} />
      <SearchModal showSearch={showSearch} setShowSearch={setShowSearch} />
      <div className="container-sm">
        <div className="row">
          <div className="col-12 fs-1 text-center mt-2">Clans</div>
        </div>
        <div className="row mb-3 bg-light py-2">
          <div className="col-4 d-flex justify-content-center">
            <button className="btn btn-info" onClick={() => navigate("/")}>
              Go back
            </button>
          </div>
          <div className="col-4 d-flex justify-content-center">
            <button
              className="btn btn-info"
              onClick={() => setShowSearch(true)}
            >
              Search clans
            </button>
          </div>
          <div className="col-4 d-flex justify-content-center">
            {hasClan ? (
              <button className="btn btn-info" onClick={handleShow}>
                Leave Clan
              </button>
            ) : (
              <button
                className="btn btn-info"
                onClick={() => setShowCreate(true)}
              >
                {" "}
                Create Clan
              </button>
            )}
          </div>
        </div>
        {hasClan ? (
          <JoinedClan
            show={show}
            setShow={setShow}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            showInfo={showInfo}
            setShowInfo={setShowInfo}
          />
        ) : (
          <div className="row">
            <div className="col-12 text-center display-6">
              Feel free to join or create a clan
            </div>
            <div className="col-12 my-1 text-center">
              You might need some friends !
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Clans;
