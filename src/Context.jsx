import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AppContext = React.createContext();
export const useAppContext = () => useContext(AppContext);

const Context = ({ children }) => {
  const [userSocket, setUserSocket] = useState({});
  const [wins, setWins] = useState(0);
  const [socketId, setSocketId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [hasClan, setHasClan] = useState(false);
  const [clanDetails, setClanDetails] = useState({});
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [clanMessages, setClanMessages] = useState([]);

  const navigate = useNavigate();

  const giveProperty = (array, property, value) => {
    const newArray = array.map((o) => {
      o[property] = value;
      return { ...o };
    });
    return newArray;
  };

  const getData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (userSocket.connected === true) {
        userSocket.disconnect();
      }
      console.log("no token");
      return;
    }
    try {
      const resp = await axios.get("http://localhost:5000/api/v1/getHomepage", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(resp.data);

      if (resp.data.userClan != null) {
        setClanDetails({ ...resp.data.userClan });
        setHasClan(true);
      }
      console.log(resp.data);
      setFriends(resp.data.friends);
      setSocketId(resp.data.username);
      setWins(resp.data.wins);
      const nots = giveProperty(resp.data.notifications, "isLoading", false);
      setNotifications(nots);
      setOnlineFriends(resp.data.onlineFriends);
    } catch (error) {
      console.log(error);

      if (error.response.data.msg === "JWT authorization Invalid") {
        localStorage.removeItem("token");
        navigate("/auth");
      }
    }
  };
  useEffect(() => {
    if (socketId) return;
    getData();
  }, [socketId]);

  useEffect(() => {
    if (!socketId) return;
    const socket = io("http://localhost:3000", {
      query: {
        id: socketId,
      },
    });

    socket.on("friend-request", (friend) => {
      console.log("request");
      getData();
      toast.info(`You have a friend request by ${friend}`, {
        position: "top-center",
      });
    });
    socket.on("got-accepted", (user) => {
      getData();
      toast.success(`${user} accepted your friend request`);
    });
    socket.on("challenge-received", (user) => {
      getData();
      toast.success(`${user} has sent you a challenge`);
    });
    socket.on("challenge-back", (user) => {
      getData();
      toast.info(`user ${user} is afraid of you`);
    });
    socket.on("clan-request", () => {
      toast.info("you have a new clan request");
      getData();
    });
    socket.on("unfriend", (user) => {
      toast.info(`user ${user} is no longer your friend`);
      getData();
    });
    socket.on("teamMate-left", (name) => {
      setClanMessages((prev) => [
        ...prev,
        { from: "clan", msg: `${name} has left the clan` },
      ]);
      getData();
    });
    socket.on("challenge-accepted", (from, gameId) => {
      navigate(`/vsFriend/${from}/1/${gameId}`);
    });
    socket.on("new-clan", async () => {
      toast.success("your clan request has been accepted");
      await getData();
      setHasClan(true);
    });
    socket.on("kicked", () => {
      toast.warning("you have been kicked from your clan");
      setHasClan(false);
      setClanMessages([]);
      setClanDetails({});
      getData();
    });
    socket.on("mate-kicked", (name) => {
      setClanMessages((prev) => [
        ...prev,
        { from: "clan", msg: `${name} has been kicked` },
      ]);
      getData();
    });
    socket.on("new-owner", (name) => {
      setClanMessages((prev) => [
        ...prev,
        { from: "clan", msg: `${name} is the new clan owner` },
      ]);
      getData();
    });
    socket.on("promoted", () => {
      toast.info("You are the new clan owner");
      getData();
    });
    socket.on("new-clanMate", (name) => {
      setClanMessages((prev) => [
        ...prev,
        { from: "clan", msg: `${name} joined the clan` },
      ]);
      getData();
    });
    socket.on("clan-message-receive", (msg, id) => {
      console.log("rec");
      console.log(hasClan);
      if (!hasClan) return;
      setClanMessages((prev) => {
        return [...prev, { msg, from: id }];
      });
    });
    setUserSocket(socket);
    return () => socket.off("http://localhost:3000");
  }, [socketId, hasClan]);

  return (
    <AppContext.Provider
      value={{
        socketId,
        setSocketId,
        friends,
        notifications,
        userSocket,
        setNotifications,
        getData,
        setUserSocket,
        setFriends,
        onlineFriends,
        setOnlineFriends,
        hasClan,
        setHasClan,
        clanDetails,
        setClanDetails,
        clanMessages,
        setClanMessages,
        wins,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default Context;
