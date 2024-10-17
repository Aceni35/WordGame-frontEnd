import React, { useEffect, useReducer, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import reducer from "../reducers/reducer";
import { useAppContext } from "../Context";

const initialState = {
  definition: "",
  showOverlay: true,
  noGuesses: 0,
  isGameOver: false,
  word: "",
  partOfSpeech: "",
  lastScore: 0,
  API: "http://localhost:5000",
  attempts: [],
};

const Classic = () => {
  const Content = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState("");
  const { clanDetails, hasClan } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getWord = async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${state.API}/api/v1/word`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      dispatch({ type: "GET_WORD", payload: { Content, data, dispatch } });
    };
    getWord();
  }, []);

  return (
    <>
      {state.showOverlay && (
        <div className="overlay">
          <div className="content rounded bg-light content-enter" ref={Content}>
            <div className="text-container">
              {!state.isGameOver ? "Your word is..." : `Correct`}
            </div>
            <div className="word-container text-center">
              {!state.isGameOver
                ? state.word
                : `it took you ${state.noGuesses} tries and you got a score of ${state.lastScore}/10`}
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
              {state.isGameOver && (
                <div
                  className="btn btn-success mt-3 mx-2"
                  onClick={() => window.location.reload()}
                >
                  Play again
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="row ">
        <div className="col-12 fs-1 text-center pt-2">Classic Game</div>
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
                    navigate("/");
                  }}
                >
                  Quit
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-success px-4 mt-2"
                  onClick={() => {
                    if (input) {
                      let clan = clanDetails.name;
                      dispatch({
                        type: "SUBMIT_ATTEMPT",
                        payload: { attempt: input, Content, clan, hasClan },
                      });
                    }
                  }}
                >
                  Submit
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
                className="col-8 att-card border border-2 mb-2 border-dark rounded"
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

export default Classic;
