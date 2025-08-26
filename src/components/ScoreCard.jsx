import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getTrendColor, formatTrend } from '../utils/calculations';
import { formatScore } from '../utils/formatters';

const ScoreCard = ({ title, score, trend, description, color = "primary" }) => {
  const getTrendIcon = (trendValue) => {
    const numTrend = parseFloat(trendValue);
    if (numTrend > 0) return <TrendingUp className="w-4 h-4" />;
    if (numTrend < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className={`flex items-center space-x-1 ${getTrendColor(trend)}`}>
          {getTrendIcon(trend)}
          <span className="text-sm font-medium">{formatTrend(trend)}</span>
        </div>
      </div>
      
      <div className="text-center">
        <div className={`score-display text-${color}`}>
          {formatScore(score)}
        </div>
        <div className="text-sm text-gray-500 mt-1">점</div>
        
        {description && (
          <div className="text-sm text-gray-600 mt-3 text-left">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;