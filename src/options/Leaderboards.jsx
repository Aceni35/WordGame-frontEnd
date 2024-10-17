import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
const api = "http://localhost:5000";

const Leaderboards = () => {
  const navigate = useNavigate();
  const [lead, setLead] = useState([]);
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getLeaderboards = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/api/v1/leaderboards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLead(res.data.info);
      setUser(res.data.username);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaderboards();
  }, []);
  if (isLoading) {
    return (
      <div className="row">
        <div className="col-12 mt-4 text-center">
          <Spinner />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="row justify-content-center">
        <div className="col-12 fs-1 text-center mt-2">
          WordGame leaderboards
        </div>
        <div className="col-10 col-md-6 col-lg-4  ">
          <div className="row mt-1 bg-primary">
            <div className="col-1 text-danger">R</div>
            <div className="col-5">Username:</div>
            <div className="col-2">GP</div>
            <div className="col-2">GPG</div>
            <div className="col-2">GW</div>
          </div>
          {lead.map((x, index) => {
            let classes = "row mt-2 border border-2 bg-primary";
            if (x.username === user) {
              classes = "row mt-2 border border-2 bg-info";
            }
            return (
              <div className={classes}>
                <div className="col-1 text-danger">{index + 1}</div>
                <div className="col-5">{x.name}</div>
                <div className="col-2">{x.played}</div>
                <div className="col-2">{x.avgGuess.toString().slice(0, 3)}</div>
                <div className="col-2">{x.wins}</div>
              </div>
            );
          })}
          <div className="col-12">
            <button
              className="btn btn-warning my-3 ms-2"
              onClick={() => {
                navigate("/");
              }}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboards;
