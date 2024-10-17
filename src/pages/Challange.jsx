import React, { useEffect, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { GiCancel } from "react-icons/gi";
import { FaBackward } from "react-icons/fa";
import { useAppContext } from "../Context";
import { useNavigate } from "react-router-dom";

const Challange = () => {
  const { friends, userSocket, getData } = useAppContext();
  const navigate = useNavigate();
  const [Friends, setFriends] = useState([]);
  console.log(friends);
  useEffect(() => {
    const f = friends.map((f) => {
      return { ...f, isEdit: false };
    });
    setFriends(f);
  }, [friends]);
  console.log(Friends);
  return (
    <div className="container-sm ">
      <div className="row ">
        <div className="col-12 text-center m-3 fs-3">Your friends:</div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-12 ">
          <div className="row bg-light">
            <div className="col-6">Username</div>
            <div className="col-3">Record</div>
            <div className="col-3">Manage Friendship</div>
          </div>
          {Friends.map((f) => {
            return (
              <div className="row mt-1 bg-light">
                <div className="col-6">{f.username}</div>
                <div className="col-3">
                  <span className="text-green">W</span> /{" "}
                  <span className="text-danger">L</span>
                </div>
                <div className="col-3 text-center">
                  {!f.isEdit ? (
                    <SlOptions
                      size={30}
                      onClick={() => {
                        const newF = Friends.map((fr) => {
                          if (fr.username === f.username) {
                            return { ...fr, isEdit: true };
                          } else {
                            return { ...fr };
                          }
                        });
                        setFriends(newF);
                      }}
                    />
                  ) : (
                    <>
                      <span
                        className="text-danger border me-1"
                        onClick={() => {
                          const newArray = Friends.map((fr) => {
                            if (fr.username === f.username) {
                              return { ...f, isLoading: true };
                            }
                          });
                          setFriends(newArray);
                          const makeChanges = () => {
                            getData();
                          };
                          userSocket.emit(
                            "remove-friend",
                            f.username,
                            makeChanges
                          );
                        }}
                      >
                        <button disabled={f.isLoading}>Remove</button>
                      </span>
                      <span
                        className="text-success"
                        onClick={() => {
                          const newF = Friends.map((fr) => {
                            if (fr.username === f.username) {
                              return { ...fr, isEdit: false };
                            } else {
                              return { ...fr };
                            }
                          });
                          setFriends(newF);
                        }}
                      >
                        <GiCancel color="green" size={30} />
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="row">
        <div
          className="col-md-3 col-12 text-center"
          onClick={() => {
            navigate("/");
          }}
        >
          <FaBackward size={30} /> Go back
        </div>
      </div>
    </div>
  );
};

export default Challange;
