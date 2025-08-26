import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatScore } from '../utils/formatters';

const RankingChart = ({ departments }) => {
  const topDepartments = departments.slice(0, 10);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-primary">
            청렴지수: <span className="font-bold">{formatScore(payload[0].value)}점</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-xl font-bold text-gray-800">부서별 청렴지수 순위</h3>
        <p className="text-sm text-gray-600">상위 10개 부서 현황</p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={topDepartments}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#666"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            domain={[60, 90]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="score" 
            fill="#2E7D32"
            radius={[4, 4, 0, 0]}
            name="청렴지수"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankingChart;