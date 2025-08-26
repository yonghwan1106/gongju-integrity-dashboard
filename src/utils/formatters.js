export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatMonth = (monthString) => {
  const date = new Date(monthString);
  return date.toLocaleDateString('ko-KR', {
    month: 'short'
  });
};

export const formatScore = (score) => {
  return parseFloat(score).toFixed(1);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('ko-KR').format(number);
};