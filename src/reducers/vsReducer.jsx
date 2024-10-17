import axios from "axios";
import test from "../components/testDef";

const reducer = (state, action) => {
  if (action.type === "RECEIVE_LOSS") {
    const { att } = action.payload;
    console.log(att);
    const rating = test(state.definition, att);
    const realRating = rating * 10;
    return {
      ...state,
      noGuesses: state.noGuesses + 1,
      isGameOver: true,
      showOverlay: true,
      isWin: false,
      lastScore: realRating.toString().slice(0, 3),
      attempts: [{ ...att }, ...state.attempts],
    };
  }
  if (action.type === "OPP-QUIT") {
    return {
      ...state,
      isGameOver: true,
      showOverlay: true,
      isQuit: true,
      isWin: true,
    };
  }
  if (action.type === "SUBMIT_ATTEMPT") {
    const { attempt, userSocket, params } = action.payload;
    const rating = test(state.definition, attempt);

    const realRating = rating * 10;
    if (realRating >= 6) {
      console.log(rating);
      userSocket.emit("send-win", state.player, attempt, params.gameId);

      return {
        ...state,
        noGuesses: state.noGuesses + 1,
        isGameOver: true,
        showOverlay: true,
        isWin: true,
        lastScore: realRating.toString().slice(0, 3),
        attempts: [
          { score: realRating.toString().slice(0, 3), text: attempt },
          ...state.attempts,
        ],
      };
    } else {
      userSocket.emit("send-attempt", {
        score: realRating.toString().slice(0, 3),
        text: attempt,
        player: state.opponent,
        playerName: state.player,
      });
      return {
        ...state,
        noGuesses: state.noGuesses + 1,
        turn: !state.turn,
        attempts: [
          {
            score: realRating.toString().slice(0, 3),
            text: attempt,
            player: state.opponent,
          },
          ...state.attempts,
        ],
      };
    }
  }
  if (action.type === "RECEIVE_ATTEMPT") {
    return {
      ...state,
      turn: !state.turn,
      attempts: [action.payload.data, ...state.attempts],
    };
  }
  if (action.type === "REMOVE_OVERLAY") {
    return {
      ...state,
      showOverlay: false,
    };
  }
  if (action.type === "GET_WORD") {
    const { data, Content, dispatch } = action.payload;
    setTimeout(() => {
      Content.current.classList.remove("content-enter");
      Content.current.classList.add("content-leave");
      setTimeout(() => {
        dispatch({ type: "REMOVE_OVERLAY" });
      }, 1400);
    }, 2000);

    return {
      ...state,
      word: data.word,
      partOfSpeech: data.partOfSpeech,
      definition: data.def,
    };
  }
  if (action.type === "SET_DATA") {
    let playerTurn = true;
    if (Number(action.payload.params.opponent) === 2) {
      playerTurn = false;
    }
    return {
      ...state,
      opponent: Number(action.payload.params.opponent),
      player: action.payload.params.player,
      turn: playerTurn,
    };
  }
};
export default reducer;
