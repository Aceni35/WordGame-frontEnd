import React, { useEffect, useReducer, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import reducer from "../reducers/vsReducer";
import { useAppContext } from "../Context";

const initialState = {
  definition: "",
  showOverlay: true,
  noGuesses: 0,
  isGameOver: false,
  isWin: false,
  opponent: "",
  answer: "",
  turn: true,
  word: "",
  partOfSpeech: "",
  lastScore: 0,
  isQuit: false,
  player: 1,
  API: "http://localhost:5000",
  attempts: [],
};

const vsFriend = () => {
  const Content = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState("");
  const [isGame, setIsGame] = useState("loading");
  const [hasLeft, setHasLeft] = useState(false);
  const navigate = useNavigate();
  const { userSocket } = useAppContext();
  const params = useParams();

  useEffect(() => {
    const checkGame = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/checkGame?gameId=${params.gameId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success === true) {
          setIsGame("found");
        } else if (res.data.success === false) {
          setIsGame("not-found");
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    checkGame();
  }, []);

  useEffect(() => {
    const handleUnload = (event) => {
      event.preventDefault();
      userSocket.emit("opp-giveup", params.player, params.gameId);
      setHasLeft(true);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_DATA", payload: { params } });
  }, []);

  useEffect(() => {
    if (isGame != "found") return;
    if (state.player === 1) return;
    if (state.opponent != 1) return;
    if (!userSocket) return;
    const getWord = async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${state.API}/api/v1/vsWord`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      const cb = () => {
        dispatch({ type: "GET_WORD", payload: { Content, data, dispatch } });
      };
      console.log(userSocket);
      userSocket.emit("send-word", data, state.player, cb);
      console.log("done");
    };
    getWord();
  }, [userSocket, state.opponent, isGame]);

  useEffect(() => {
    if (isGame != "found") return;
    if (userSocket.connected === undefined) return;
    if (state.player === 1) return;
    if (state.opponent != 2) return;
    console.log("pass");
    userSocket.on("your-word", (data) => {
      console.log(data);
      dispatch({ type: "GET_WORD", payload: { Content, data, dispatch } });
    });
  }, [userSocket, state.opponent, isGame]);

  useEffect(() => {
    if (userSocket.connected === undefined) return;
    userSocket.on("receive-attempt", (data) => {
      dispatch({ type: "RECEIVE_ATTEMPT", payload: { data } });
    });
    userSocket.on("you-lost", (att) => {
      dispatch({ type: "RECEIVE_LOSS", payload: { att } });
    });
    userSocket.on("opp-quit", () => {
      dispatch({ type: "OPP-QUIT" });
    });
  }, [userSocket]);

  if (isGame === "loading") {
    return (
      <>
        <div className="row">
          <h3 className="col-12 text-center mt-3">Game is loading...</h3>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  } else if (isGame === "not-found") {
    return (
      <>
        <div className="row">
          <h3 className="col-12 text-center mt-3">This game is invalid</h3>
          <div className="col-12 text-center">
            <button
              className="btn btn-dark"
              onClick={() => {
                navigate("/");
              }}
            >
              {" "}
              Go back{" "}
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {state.showOverlay && (
        <div className="overlay">
          <div className="content rounded bg-light content-enter" ref={Content}>
            <div className="text-container text-center">
              {!state.isGameOver && "Your word is..."}
              {state.isGameOver && state.isWin && !state.isQuit && "Correct"}
              {state.isGameOver &&
                state.isWin &&
                state.isQuit &&
                "Opponent gave up. You win"}
              {state.isGameOver && !state.isWin && "You lost"}
            </div>
            <div className="word-container text-center">
              {!state.isGameOver && state.word}
              {state.isGameOver &&
                state.isWin &&
                !state.isQuit &&
                `it took you ${state.noGuesses} tries and you got a score of ${state.lastScore}/10`}
              {state.isGameOver && !state.isWin && !state.isQuit && (
                <>
                  The correct definition was <h6>${state.definition}</h6>
                </>
              )}
            </div>
            <div>
              {state.isGameOver && (
                <div
                  className="btn btn-warning mt-3 mx-2"
                  onClick={() => navigate("/")}
                >
                  Go back
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="row ">
        <div className="col-12 fs-1 text-center pt-2">
          Game against {state.player}
        </div>
        <div className="col-12 text-center text-center fs-1 text-light word-card">
          Your word is {state.word}
        </div>
        <div className="row hints-card py-3">
          <div className="col-6 text-center fs-3">
            The definition has {state.definition.split(" ").length} words
          </div>
          <div className="col-6 text-center fs-3">
            It's a {state.partOfSpeech}
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-6 col-12  my-3 text-center">
            <input
              type="text"
              className="info-input def-input rounded fs-4"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <div className="row">
              <div className="col-6">
                <button
                  className="btn btn-danger px-4 mt-2"
                  onClick={() => {
                    userSocket.emit("opp-giveup", params.player, params.gameId);
                    navigate("/");
                  }}
                >
                  Quit
                </button>
              </div>
              <div className="col-6">
                <button
                  disabled={!state.turn || hasLeft}
                  className={
                    state.turn
                      ? "btn btn-success px-4 mt-2"
                      : "btn btn-warning px-4 mt-2"
                  }
                  onClick={() => {
                    if (input) {
                      dispatch({
                        type: "SUBMIT_ATTEMPT",
                        payload: { attempt: input, userSocket, params },
                      });
                    }
                  }}
                >
                  {state.turn ? <>Submit</> : <>Opponents turn</>}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-8 mb-3 fs-4">
            Attempts ({state.attempts.length}) :
          </div>
        </div>
        <div className="row justify-content-center ">
          {state.attempts.map((att, index) => {
            return (
              <div
                key={index}
                className={
                  att.player === state.opponent
                    ? "col-8 att-card border border-2 mb-2 border-dark rounded"
                    : "col-8 att-card-opp border border-2 mb-2 border-dark rounded"
                }
              >
                <div className="row align-items-center">
                  <div className="col-10 col-md-11">{att.text}</div>
                  <div className="col-2 col-md-1 text-light text-center">
                    {att.score}/10
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default vsFriend;
