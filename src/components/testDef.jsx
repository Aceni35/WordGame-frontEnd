import stringSimilarity from "string-similarity";

const checkSentenceSimilarity = (sentence1, sentence2) => {
  const similarity = stringSimilarity.compareTwoStrings(sentence1, sentence2);

  return similarity;
};

export default checkSentenceSimilarity;
