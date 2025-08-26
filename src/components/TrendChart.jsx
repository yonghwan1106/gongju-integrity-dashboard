import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatMonth, formatScore } from '../utils/formatters';

const TrendChart = ({ monthlyData }) => {
  const formattedData = monthlyData.map(item => ({
    ...item,
    monthDisplay: formatMonth(item.month + '-01')
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: <span className="font-bold">{formatScore(entry.value)}점</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-xl font-bold text-gray-800">월별 청렴지수 추이</h3>
        <p className="text-sm text-gray-600">최근 6개월 변화 현황</p>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="monthDisplay" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            domain={[70, 85]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="totalScore" 
            stroke="#2E7D32" 
            strokeWidth={3}
            name="전체 평균"
            dot={{ fill: '#2E7D32', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="contractScore" 
            stroke="#43A047" 
            strokeWidth={2}
            name="계약 분야"
            dot={{ fill: '#43A047', strokeWidth: 2, r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="personnelScore" 
            stroke="#66BB6A" 
            strokeWidth={2}
            name="인사 분야"
            dot={{ fill: '#66BB6A', strokeWidth: 2, r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="budgetScore" 
            stroke="#2196F3" 
            strokeWidth={2}
            name="예산 분야"
            dot={{ fill: '#2196F3', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;