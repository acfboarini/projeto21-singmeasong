export function compareScores(recommendations: Array<any>) {
  recommendations = recommendations.reverse();
  let maxScore = -1;
  recommendations.forEach(recommendation => {
      const score = recommendation.score;
      if (score > maxScore) {
          maxScore = score;
      } else {
          return false;
      }
  })
  return true;
}