import React, { useEffect, useState } from "react";
import { useAppContext } from "../Context";
import { TiTickOutline } from "react-icons/ti";
import { MdDoNotDisturb } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SingleNot = ({ not }) => {
  const {
    setNotifications,
    notifications,
    userSocket,
    getData,
    clanDetails,
    setClanMessages,
  } = useAppContext();
  const setLoading = (not) => {
    const newNots = notifications.map((n) => {
      if (
        n.type === not.type &&
        n.from === not.from &&
        n.isAccepted === not.isAccepted
      ) {
        return { ...n, isLoading: !n.isLoading };
      }
      return { ...n };
    });
    setNotifications(newNots);
  };
  const navigate = useNavigate();

  if (not.type === "friend-request" && not.isAccepted === "rejected") {
    return (
      <div className="col-12">
        You rejected a friend request from
        <span style={{ color: "red" }}> {not.from}</span>
      </div>
    );
  }
  if (not.type === "clan-request" && not.isAccepted === "false") {
    return (
      <div className="col-12">
        You rejected
        <span style={{ color: "red" }}> {not.from}</span>'s clan request
      </div>
    );
  } else if (not.type === "clan-request" && not.isAccepted === "not-possible") {
    return (
      <div className="col-12">
        <span className="me-1" style={{ color: "red" }}>
          {" "}
          {not.from}
        </span>
        has already joined another clan
      </div>
    );
  } else if (not.type === "clan-request" && not.isAccepted === "true") {
    return (
      <div className="col-12">
        <span className="me-1" style={{ color: "red" }}>
          {" "}
          {not.from}
        </span>
        has joined your clan
      </div>
    );
  } else if (not.type === "clan-request" && not.isAccepted === "no-answer") {
    return (
      <>
        <div className="col-8 d-flex align-items-center">
          <span className="me-1" style={{ color: "red" }}>
            {not.from}{" "}
          </span>
          wants to join your clan
        </div>
        <div className="col-2">
          <button
            disabled={not.isLoading}
            onClick={() => {
              setLoading(not);
              const cb = (type, msg) => {
                getData();
                setClanMessages((prev) => [
                  ...prev,
                  { from: "clan", msg: `${not.from} joined the clan` },
                ]);
                setLoading(not);
                if (type && msg) {
                  toast[type](msg);
                }
              };
              userSocket.emit(
                "accept-clanMate",
                not.from,
                clanDetails.name,
                cb
              );
            }}
          >
            <TiTickOutline size={25} />
          </button>
        </div>
        <div className="col-2">
          <button disabled={not.isLoading}>
            <MdDoNotDisturb
              size={25}
              onClick={() => {
                setLoading(not);
                const cb = () => {
                  getData();
                  setLoading(not);
                };
                userSocket.emit("reject-clanMate", not.from, cb);
              }}
            />
          </button>
        </div>
      </>
    );
  } else if (not.isAccepted === "true" && not.type === "friend-request") {
    return (
      <div className="col-12">
        You have a new friend named{" "}
        <span style={{ color: "red" }}> {not.from}</span>
      </div>
    );
  } else if (
    not.isAccepted === "game-played" &&
    not.type === "game-challenge"
  ) {
    return (
      <div className="col-12">
        You played a game against
        <span style={{ color: "red" }}> {not.from}</span>
      </div>
    );
  } else if (not.isAccepted === "taken-back" && not.type === "game-challenge") {
    return (
      <div className="col-12">
        User
        <span style={{ color: "green" }}> {not.from}</span>
        no longer wants to play
      </div>
    );
  } else if (not.isAccepted === "no-answer" && not.type === "game-challenge") {
    return (
      <>
        <div className="col-8">
          You have a challenge from
          <span style={{ color: "green" }}> {not.from}</span>
        </div>
        <div className="col-2">
          <button
            onClick={() => {
              const cb = (gameId) => {
                getData();
                navigate(`/vsFriend/${not.from}/2/${gameId}`);
              };
              userSocket.emit("accept-challenge", not.from, cb);
            }}
          >
            <TiTickOutline size={25} />
          </button>
        </div>
        <div className="col-2">
          <button>
            <MdDoNotDisturb size={25} />
          </button>
        </div>
      </>
    );
  } else if (not.isAccepted === "no-answer" && not.type === "friend-request") {
    return (
      not.isAccepted === "no-answer" && (
        <>
          <div className="col-8">
            You have a new friend request from{" "}
            <span style={{ color: "red" }}> {not.from}</span>
          </div>
          <div className="col-2 d-flex align-items-center">
            <button
              disabled={not.isLoading}
              onClick={() => {
                const newNots = notifications.map((n) => {
                  if (
                    n.type === not.type &&
                    n.from === not.from &&
                    n.isAccepted === not.isAccepted
                  ) {
                    return { ...n, isLoading: true };
                  }
                  return { ...n };
                });
                setNotifications(newNots);
                const makeChanges = () => {
                  getData();
                };
                userSocket.emit("accept-friend", not.from, makeChanges);
              }}
            >
              <TiTickOutline size={25} />
            </button>
          </div>
          <div className="col-2 d-flex align-items-center">
            <button
              disabled={not.isLoading}
              onClick={() => {
                const makeChanges = () => {
                  getData();
                };
                userSocket.emit("reject-friend", not.from, makeChanges);
              }}
            >
              <MdDoNotDisturb size={25} />
            </button>
          </div>
        </>
      )
    );
  } else if (not.type === "got-accepted" && not.isAccepted === "true") {
    return (
      <div className="col-12">
        You friend request has been accepted by
        <span style={{ color: "red" }}> {not.from}</span>
      </div>
    );
  } else {
    return <div className="col-12">Something went wrong</div>;
  }
};

export default SingleNot;
