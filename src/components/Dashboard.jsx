import React, { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp, Shield, Bot, Filter, Download, Activity } from 'lucide-react';
import ScoreCard from './ScoreCard';
import RankingChart from './RankingChart';
import TrendChart from './TrendChart';
import AIInsights from './AIInsights';
import DataFilters from './DataFilters';
import ExportTools from './ExportTools';
import ThemeToggle from './ThemeToggle';
import LiveDataSimulator from './LiveDataSimulator';
import NotificationSystem from './NotificationSystem';
import mockData from '../data/mockData.json';
import { formatDate, formatScore, formatNumber } from '../utils/formatters';
import { calculateGrade, getGradeColor } from '../utils/calculations';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentView, setCurrentView] = useState('overview');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    
    let filtered = { ...data };
    
    if (filters.departments && filters.departments.length > 0) {
      filtered.departments = data.departments.filter(dept => 
        filters.departments.includes(dept.id)
      );
    }
    
    if (filters.scoreRange) {
      filtered.departments = (filtered.departments || data.departments).filter(dept => 
        dept.score >= filters.scoreRange.min && dept.score <= filters.scoreRange.max
      );
    }
    
    setFilteredData(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const { integrationIndex, departments, monthlyTrends, statistics } = data;
  const displayData = filteredData || data;

  const handleLiveDataUpdate = (newData) => {
    setData(newData);
    setFilteredData(newData);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b-4 border-primary transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">공주시 청렴지수 대시보드</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">청렴 공주 온도계</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2025년 공주시 청렴시책 아이디어 공모전 출품작</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatScore(integrationIndex.totalScore)}
                </div>
                <div className={`grade-display ${getGradeColor(integrationIndex.grade)}`}>
                  {integrationIndex.grade}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(integrationIndex.lastUpdated)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">최종 업데이트</div>
              </div>

              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <NotificationSystem data={data} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 네비게이션 탭 */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {[
              { id: 'overview', label: '전체 현황', icon: Shield },
              { id: 'live', label: '실시간 시뮬레이션', icon: Activity },
              { id: 'ai', label: 'AI 분석', icon: Bot },
              { id: 'filters', label: '데이터 필터', icon: Filter },
              { id: 'export', label: '내보내기', icon: Download }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === tab.id 
                      ? 'bg-white dark:bg-gray-900 text-primary shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        {/* 조건부 렌더링 */}
        {currentView === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ScoreCard
            title="전체 청렴지수"
            score={integrationIndex.totalScore}
            trend={statistics.improvementRate}
            description="모든 분야 종합 점수"
            color="primary"
          />
          <ScoreCard
            title="계약 분야"
            score={integrationIndex.categories.contract.score}
            trend="+1.2"
            description="계약 투명성 및 공정성"
            color="secondary"
          />
          <ScoreCard
            title="인사 분야"
            score={integrationIndex.categories.personnel.score}
            trend="+0.8"
            description="인사 운영의 투명성"
            color="accent"
          />
          <ScoreCard
            title="예산 분야"
            score={integrationIndex.categories.budget.score}
            trend="+1.5"
            description="예산 편성 및 집행"
            color="info"
          />
        </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <RankingChart departments={displayData.departments} />
              </div>
              
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-800">주요 통계</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-gray-700">전체 부서</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {statistics.totalDepartments}개
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-gray-700">평균 점수</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {formatScore(statistics.averageScore)}점
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-gray-700">시민 만족도</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {formatScore(integrationIndex.citizenSatisfaction)}점
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-gray-700">참여 시민</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {formatNumber(statistics.citizenParticipation)}명
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <TrendChart monthlyData={monthlyTrends} />
            </div>
          </>
        )}

        {currentView === 'live' && (
          <LiveDataSimulator 
            onDataUpdate={handleLiveDataUpdate}
            initialData={mockData}
          />
        )}

        {currentView === 'ai' && (
          <AIInsights data={data} />
        )}

        {currentView === 'filters' && (
          <DataFilters 
            data={data} 
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        )}

        {currentView === 'export' && (
          <ExportTools data={displayData} />
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div>
              <p>&copy; 2025 공주시청. 모든 권리 보유.</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2025년 공주시 청렴시책 아이디어 공모전 출품작</p>
            </div>
            <div className="flex items-center space-x-4">
              <span>데이터 업데이트: {formatDate(integrationIndex.lastUpdated)}</span>
              <span>|</span>
              <span>문의: integrity@gongju.go.kr</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;