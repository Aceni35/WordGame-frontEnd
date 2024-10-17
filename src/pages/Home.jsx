import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Friends from "../components/Friends";
import { useAppContext } from "../Context";
import { BsBell } from "react-icons/bs";
import Notifications from "../components/notifications";
import { Spinner } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();
  const { notifications, userSocket, setUserSocket, setSocketId, setHasClan } =
    useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [notLength, setNotLength] = useState(0);

  useEffect(() => {
    let count = 0;
    notifications.forEach((n) => {
      if (n.isAccepted === "no-answer") {
        count++;
      }
    });
    setNotLength(count);
  }, [notifications]);

  return (
    <>
      <Notifications showModal={showModal} setShowModal={setShowModal} />
      <div className="bell" onClick={() => setShowModal(true)}>
        <BsBell size={50} />
        {notLength != 0 && <div className="not">{notLength}</div>}
      </div>
      <div className="container-sm ">
        <div className="row ">
          <div className="col-12 fs-1 text-center mt-2">WordGame</div>
          <div className="row justify-content-center mt-5">
            {/* left part */}
            <div className="col-lg-5 col-7">
              <div className="row">
                <div
                  className=" col-12 options-text  menu-options"
                  onClick={() => navigate("/classic")}
                >
                  Play classic
                </div>
              </div>
              <div className="row">
                <div
                  className="col-12 options-text rounded-1  menu-options"
                  onClick={() => navigate("/leaderboards")}
                >
                  Leaderboards and Profile
                </div>
              </div>
              <div className="row">
                <div
                  className=" col-12 options-text  menu-options"
                  onClick={() => navigate("/challenge")}
                >
                  Full friends list
                </div>
              </div>
              <div className="row">
                <div
                  className="col-12 options-text  menu-options"
                  onClick={() => navigate("/clans")}
                >
                  Join or create a clan
                </div>
              </div>
              <div className="row justify-content-center">
                <div
                  className=" menu-options col-6 text-center options-text   "
                  style={{ marginRight: "2px", marginLeft: "-2px" }}
                  onClick={() => navigate("/options")}
                >
                  Options
                </div>
                <div
                  className="col-6 text-center menu-options options-text  "
                  style={{ marginLeft: "2px", marginRight: "-2px" }}
                  onClick={() => {
                    userSocket.disconnect();
                    setUserSocket({});
                    setSocketId("");
                    setHasClan(false);
                    localStorage.removeItem("token");
                    navigate("/auth");
                  }}
                >
                  Log out
                </div>
              </div>
            </div>
            {/* right part */}
            <Friends />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
