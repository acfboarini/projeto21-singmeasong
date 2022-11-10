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

export function validateScores(recommendations: any[], maxScore: number) {
    recommendations.forEach(recommendation => {
        if (recommendation.socre > maxScore) return false
    });
    return true;
}

export function generateRandomNumberWithinRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
}
