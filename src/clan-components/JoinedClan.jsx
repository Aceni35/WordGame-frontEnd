import React, { useEffect, useRef, useState } from "react";
import Modal2 from "./Modal2";
import { IoMdPersonAdd } from "react-icons/io";
import InfoModal from "./InfoModal";
import { useAppContext } from "../Context";
import { toast } from "react-toastify";
import { MdOutlineEdit } from "react-icons/md";
import Edit from "./EditClanMate";

const JoinedClan = ({ show, setShow, showInfo, setShowInfo }) => {
  const [message, setMessage] = useState("");
  const [showEdit, setShowEdit] = useState();
  const [mate, setMate] = useState("");
  const textBox = useRef(null);
  const {
    clanDetails,
    socketId,
    userSocket,
    setClanMessages,
    clanMessages,
    hasClan,
  } = useAppContext();
  const sendMessage = () => {
    if (!message) return;
    const cb = () => {
      setClanMessages((prev) => [...prev, { msg: message, from: "me" }]);
      setMessage("");
    };
    userSocket.emit("send-clan-message", clanDetails.clanMembers, message, cb);
  };
  useEffect(() => {
    textBox.current.scrollTop = textBox.current.scrollHeight;
  }, [clanMessages]);
  return (
    <>
      <Edit showEdit={showEdit} setShowEdit={setShowEdit} mate={mate} />
      <InfoModal showInfo={showInfo} setShowInfo={setShowInfo} />
      <Modal2 show={show} setShow={setShow} />

      <div className="row justify-content-center">
        <div className="col-6 col-lg-5 pe-1 bg-light">
          {/* Chat */}
          <div className="row">
            <div className="col-12 text-center fs-3">Clan chat</div>
            <div
              ref={textBox}
              className="row hide-scroll justify-content-center"
              style={{
                height: "300px",
                overflowY: "scroll",
                alignItems: "flex-end",
              }}
            >
              <div className="row">
                {clanMessages.map((x, index) => {
                  if (x.from != "clan") {
                    return (
                      <div className="row" key={index}>
                        <div className="col-12  border border-dark p-1 rounded my-1 text-break">
                          <span
                            className={
                              x.from != "me"
                                ? "bg-secondary rounded text-light p-1 me-1"
                                : "bg-secondary rounded text-dark p-1 me-1"
                            }
                          >
                            {x.from}:
                          </span>
                          {x.msg}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="row" key={index}>
                        <div className="col-12  border border-dark p-1 text-dark rounded my-1 text-center">
                          {x.msg}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <div className="col-12 d-flex justify-content-center align-items-center">
              <input
                type="text"
                className="clan-inp me-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <button className="btn btn-dark clan-send" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-5">
          <div className="col-12 bg-light">
            <div className="row">
              <div className="col-12 fs-3 text-center">{clanDetails.name}</div>
              <div className="col-12 " style={{ height: "300px" }}>
                <div className="row justify-content-center">
                  <div className="col-10 ">
                    {hasClan &&
                      clanDetails.clanMembers.map((x, index) => {
                        if (x.usr_name != socketId) {
                          return (
                            <div
                              className="row py-1 my-1 border border-dark"
                              key={index}
                            >
                              <div
                                className={
                                  clanDetails.clanOwner.usr_name === socketId
                                    ? "col-7"
                                    : "col-9"
                                }
                              >
                                {x.usr_name}
                              </div>
                              {clanDetails.clanOwner.usr_name === socketId && (
                                <div
                                  className="col-2"
                                  onClick={() => {
                                    setMate(x.usr_name);
                                    setShowEdit(true);
                                  }}
                                >
                                  <MdOutlineEdit />
                                </div>
                              )}
                              <div
                                className="col-2"
                                onClick={() => {
                                  const giveToast = (text) => {
                                    toast.info(text);
                                  };
                                  let username = socketId;
                                  let friend = x.usr_name;

                                  userSocket.emit(
                                    "add-friend",
                                    { username, friend },
                                    giveToast
                                  );
                                }}
                              >
                                <IoMdPersonAdd />
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className="row py-1 bg-secondary text-light my-1 border border-dark"
                              key={index}
                            >
                              <div className="col-9">{x.usr_name}</div>
                            </div>
                          );
                        }
                      })}
                  </div>
                </div>
              </div>
              <div className="col-12 text-center py-1">
                <button
                  className="btn btn-success"
                  onClick={() => setShowInfo(true)}
                >
                  More info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinedClan;
