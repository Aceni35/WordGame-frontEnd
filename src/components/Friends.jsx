import React, { useState } from "react";
import { useAppContext } from "../Context";
import Modal from "./modal";
import SingleUser from "./SingleUser";
const Friends = () => {
  const { onlineFriends } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [showSingle, setShowSingle] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <Modal showModal={showModal} setShowModal={setShowModal} />
      <SingleUser
        showSingle={showSingle}
        setShowSingle={setShowSingle}
        user={search}
      />
      <div
        className="col-md-4 rounded bg-light col-5 text-center "
        style={{ marginLeft: "5px", marginRight: "-5px" }}
      >
        <div className="col-12 right-text">Your friends</div>
        <div className="row flex-column" style={{ height: "296px" }}>
          {onlineFriends.length === 0 ? (
            <h6>You have no online friends</h6>
          ) : (
            onlineFriends.map((f, index) => {
              return (
                <div
                  className="col-12  mb-1"
                  key={index}
                  style={{ height: "24px" }}
                  onClick={() => {
                    setSearch(f.username);
                    setShowSingle(true);
                  }}
                >
                  <div
                    className="row friends-block border border-1 border-dark rounded"
                    onClick={() => {
                      setShowSingle(true);
                    }}
                  >
                    <div className="col-9 text-start ">{f.username}</div>
                    <div className="col-3 text-success">On</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div
          className="col-12 right-text  border-top border-1  border-dark"
          onClick={() => setShowModal(true)}
        >
          Add more friends
        </div>
      </div>
    </>
  );
};

export default Friends;
