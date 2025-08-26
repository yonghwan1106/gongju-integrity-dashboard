export const calculateGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 65) return 'C';
  if (score >= 60) return 'D+';
  return 'D';
};

export const getGradeColor = (grade) => {
  const colors = {
    'A+': 'grade-A', 'A': 'grade-A',
    'B+': 'grade-B', 'B': 'grade-B',
    'C+': 'grade-C', 'C': 'grade-C',
    'D+': 'grade-D', 'D': 'grade-D'
  };
  return colors[grade] || 'grade-D';
};

export const formatTrend = (trend) => {
  const numTrend = parseFloat(trend);
  if (numTrend > 0) return `+${numTrend}`;
  return numTrend.toString();
};

export const getTrendColor = (trend) => {
  const numTrend = parseFloat(trend);
  if (numTrend > 0) return 'text-green-600';
  if (numTrend < 0) return 'text-red-600';
  return 'text-gray-600';
};

export const calculateTotalScore = (categories) => {
  const { contract, personnel, budget } = categories;
  return (contract.score * contract.weight + 
          personnel.score * personnel.weight + 
          budget.score * budget.weight).toFixed(1);
};