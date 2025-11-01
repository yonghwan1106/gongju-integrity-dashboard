import React from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { getTrendColor, formatTrend } from '../utils/calculations';
import { formatScore } from '../utils/formatters';

const ScoreCard = ({ title, score, trend, description, color = "primary" }) => {
  const getTrendIcon = (trendValue) => {
    const numTrend = parseFloat(trendValue);
    if (numTrend > 0) return <TrendingUp className="w-5 h-5" />;
    if (numTrend < 0) return <TrendingDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  };

  const getColorGradient = (colorName) => {
    switch(colorName) {
      case 'primary': return 'from-primary-500 to-primary-600';
      case 'secondary': return 'from-secondary-500 to-secondary-600';
      case 'success': return 'from-green-500 to-emerald-600';
      case 'warning': return 'from-amber-500 to-orange-600';
      case 'info': return 'from-blue-500 to-cyan-600';
      default: return 'from-primary-500 to-primary-600';
    }
  };

  const getTrendBg = (trendValue) => {
    const numTrend = parseFloat(trendValue);
    if (numTrend > 0) return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
    if (numTrend < 0) return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200';
    return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
  };

  return (
    <div className="group relative card animate-fade-in">
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 rounded-2xl"></div>
      
      {/* 글로우 효과 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col">
        {/* 헤더 - 컴팩트하게 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="p-1.5 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary-600" />
            </div>
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-600 transition-colors truncate">
              {title}
            </h3>
          </div>
          
          {/* 트렌드 배지 - 더 작게 */}
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg border ${getTrendBg(trend)} ${getTrendColor(trend)} transition-all duration-300 hover:scale-105 flex-shrink-0`}>
            {getTrendIcon(trend)}
            <span className="text-xs font-bold">{formatTrend(trend)}</span>
          </div>
        </div>
        
        {/* 점수 표시 - 중앙 섹션 */}
        <div className="text-center mb-3 flex-1 flex flex-col justify-center">
          <div className="relative">
            <div className={`text-3xl font-bold bg-gradient-to-r ${getColorGradient(color)} bg-clip-text text-transparent`}>
              {formatScore(score)}
            </div>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">점수</div>
        </div>
        
        {/* 설명 - 더 컴팩트하게 */}
        {description && (
          <div className="mb-3 p-3 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
        )}
        
        {/* 하단 프로그레스 바 - 간소화 */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>진행도</span>
            <span>{Math.round((score / 100) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 bg-gradient-to-r ${getColorGradient(color)} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min((score / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

ScoreCard.propTypes = {
  title: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  trend: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'info'])
};

ScoreCard.defaultProps = {
  color: 'primary',
  description: ''
};

export default React.memo(ScoreCard);