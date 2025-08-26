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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      {/* 개선된 헤더 */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* 로고 및 제목 섹션 */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-primary to-secondary p-3 rounded-xl shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  공주시 청렴지수 대시보드
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">청렴 공주 온도계</p>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700">
                    2025 공주시 공모전
                  </span>
                </div>
              </div>
            </div>
            
            {/* 메트릭 및 컨트롤 섹션 */}
            <div className="flex items-center space-x-6">
              {/* 현재 점수 카드 */}
              <div className="hidden sm:block bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-600">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {formatScore(integrationIndex.totalScore)}
                  </div>
                  <div className={`grade-display ${getGradeColor(integrationIndex.grade)} mb-2`}>
                    {integrationIndex.grade}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">종합 청렴도</div>
                </div>
              </div>
              
              {/* 업데이트 정보 */}
              <div className="hidden md:block text-right">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(integrationIndex.lastUpdated)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">실시간 업데이트</div>
              </div>

              {/* 컨트롤 버튼들 */}
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <NotificationSystem data={data} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 개선된 네비게이션 탭 */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-2">
            <nav className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: '전체 현황', icon: Shield, color: 'blue' },
                { id: 'live', label: '실시간 시뮬레이션', icon: Activity, color: 'green' },
                { id: 'ai', label: 'AI 분석', icon: Bot, color: 'purple' },
                { id: 'filters', label: '데이터 필터', icon: Filter, color: 'orange' },
                { id: 'export', label: '내보내기', icon: Download, color: 'indigo' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = currentView === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentView(tab.id)}
                    className={`group relative flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      isActive 
                        ? (() => {
                            switch(tab.color) {
                              case 'blue': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25';
                              case 'green': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25';
                              case 'purple': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25';
                              case 'orange': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25';
                              case 'indigo': return 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25';
                              default: return 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25';
                            }
                          })()
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-100'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                    )}
                    <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'rotate-12' : 'group-hover:rotate-6'}`} />
                    <span className="hidden sm:inline relative z-10 font-semibold">{tab.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-bounce"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* 탭 설명 */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentView === 'overview' && '📊 공주시 전 부서의 청렴지수 현황과 통계를 한눈에 확인하세요'}
              {currentView === 'live' && '⚡ 실시간으로 변화하는 청렴지수 데이터를 시뮬레이션합니다'}
              {currentView === 'ai' && '🤖 Claude AI가 제공하는 청렴지수 분석과 예측 정보를 확인하세요'}
              {currentView === 'filters' && '🔍 원하는 조건에 따라 데이터를 필터링하고 분석하세요'}
              {currentView === 'export' && '📤 분석 결과를 다양한 형식으로 내보내고 공유하세요'}
            </p>
          </div>
        </div>
        {/* 조건부 렌더링 */}
        {currentView === 'overview' && (
          <div className="space-y-8">
            {/* 메트릭 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
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
                color="success"
              />
              <ScoreCard
                title="인사 분야"
                score={integrationIndex.categories.personnel.score}
                trend="+0.8"
                description="인사 운영의 투명성"
                color="warning"
              />
              <ScoreCard
                title="예산 분야"
                score={integrationIndex.categories.budget.score}
                trend="+1.5"
                description="예산 편성 및 집행"
                color="info"
              />
            </div>

            {/* 차트 및 통계 섹션 */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-slide-in">
              {/* 메인 차트 */}
              <div className="xl:col-span-2">
                <div className="card">
                  <div className="card-header">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        부서별 청렴지수 순위
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>실시간 데이터</span>
                      </div>
                    </div>
                  </div>
                  <RankingChart departments={displayData.departments} />
                </div>
              </div>
              
              {/* 통계 사이드바 */}
              <div className="space-y-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">📊 핵심 지표</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { 
                        icon: Users, 
                        label: "전체 부서", 
                        value: `${statistics.totalDepartments}개`,
                        color: "from-blue-500 to-blue-600",
                        bgColor: "from-blue-50 to-blue-100"
                      },
                      { 
                        icon: TrendingUp, 
                        label: "평균 점수", 
                        value: `${formatScore(statistics.averageScore)}점`,
                        color: "from-emerald-500 to-green-600",
                        bgColor: "from-emerald-50 to-green-100"
                      },
                      { 
                        icon: Shield, 
                        label: "시민 만족도", 
                        value: `${formatScore(integrationIndex.citizenSatisfaction)}점`,
                        color: "from-purple-500 to-purple-600",
                        bgColor: "from-purple-50 to-purple-100"
                      },
                      { 
                        icon: Users, 
                        label: "참여 시민", 
                        value: `${formatNumber(statistics.citizenParticipation)}명`,
                        color: "from-amber-500 to-orange-600",
                        bgColor: "from-amber-50 to-orange-100"
                      }
                    ].map((stat, index) => (
                      <div key={stat.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${stat.bgColor} p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                              <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                          </div>
                          <div className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                            {stat.value}
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 빠른 액션 */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">⚡ 빠른 작업</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { label: "실시간 시뮬레이션", view: "live", color: "green" },
                      { label: "AI 분석 보기", view: "ai", color: "purple" },
                      { label: "데이터 필터링", view: "filters", color: "orange" },
                      { label: "보고서 내보내기", view: "export", color: "indigo" }
                    ].map((action) => (
                      <button
                        key={action.label}
                        onClick={() => setCurrentView(action.view)}
                        className={`w-full text-left p-3 rounded-xl bg-gradient-to-r ${
                          action.color === 'green' ? 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700' :
                          action.color === 'purple' ? 'from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 text-purple-700' :
                          action.color === 'orange' ? 'from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-700' :
                          'from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700'
                        } transition-all duration-200 hover:scale-105`}
                      >
                        <span className="text-sm font-medium">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 트렌드 차트 */}
            <div className="animate-fade-in">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    월별 청렴지수 추이
                  </h3>
                </div>
                <TrendChart monthlyData={monthlyTrends} />
              </div>
            </div>
          </div>
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

      {/* 개선된 푸터 */}
      <footer className="relative bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black text-white mt-20 overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 브랜드 섹션 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">공주시 청렴지수</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                투명하고 깨끗한 공주시를 위한 청렴도 모니터링 시스템입니다. 
                실시간 데이터와 AI 분석을 통해 더 나은 행정 서비스를 제공합니다.
              </p>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-600 text-blue-100 text-xs rounded-full font-medium">
                  2025년 공모전 출품작
                </span>
              </div>
            </div>
            
            {/* 정보 섹션 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">시스템 정보</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <span>최종 업데이트:</span>
                  <span className="text-primary-300">{formatDate(integrationIndex.lastUpdated)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>총 부서 수:</span>
                  <span className="text-secondary-300">{statistics.totalDepartments}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>시민 참여:</span>
                  <span className="text-accent-300">{formatNumber(statistics.citizenParticipation)}명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>데이터 신뢰도:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-1.5">
                      <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{width: '95%'}}></div>
                    </div>
                    <span className="text-green-400">95%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 연락처 섹션 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">문의 및 지원</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold">📧</span>
                  </div>
                  <div>
                    <div className="font-medium">이메일</div>
                    <div className="text-gray-300">integrity@gongju.go.kr</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold">📞</span>
                  </div>
                  <div>
                    <div className="font-medium">대표전화</div>
                    <div className="text-gray-300">041-840-2114</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 라인 */}
          <div className="border-t border-gray-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                <p>&copy; 2025 공주시청. All rights reserved.</p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>버전 1.0.0</span>
                <span>•</span>
                <span>개발: Claude AI</span>
                <span>•</span>
                <span className="text-primary-300">실시간 모니터링 중</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;