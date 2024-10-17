import axios from "axios";
import test from "../components/testDef";

const reducer = (state, action) => {
  if (action.type === "SUBMIT_ATTEMPT") {
    const { attempt, clan: userClan, hasClan } = action.payload;
    const rating = test(state.definition, attempt);

    const realRating = rating * 10;
    if (realRating >= 6) {
      console.log(rating);

      const sendWin = async () => {
        const token = localStorage.getItem("token");
        let clan = userClan;
        if (hasClan === false) {
          clan = null;
        }
        try {
          const res = await axios.post(
            `${state.API}/api/v1/word`,
            {
              win: true,
              noGuess: state.noGuesses + 1,
              gameWord: state.word,
              clan,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(res);
        } catch (error) {
          console.log(error);
        }
      };
      sendWin();
      return {
        ...state,
        noGuesses: state.noGuesses + 1,
        isGameOver: true,
        showOverlay: true,
        lastScore: realRating.toString().slice(0, 3),
        attempts: [
          { score: realRating.toString().slice(0, 3), text: attempt },
          ...state.attempts,
        ],
      };
    } else {
      return {
        ...state,
        noGuesses: state.noGuesses + 1,
        attempts: [
          { score: realRating.toString().slice(0, 3), text: attempt },
          ...state.attempts,
        ],
      };
    }
  }
  if (action.type === "GAME_OVER") {
    return {
      ...state,
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
};
export default reducer;
