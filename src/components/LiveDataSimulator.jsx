import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Activity, Pause, Play, RotateCcw } from 'lucide-react';

const LiveDataSimulator = ({ onDataUpdate, initialData }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [currentData, setCurrentData] = useState(initialData);

  // initialData가 변경되면 currentData 업데이트
  useEffect(() => {
    if (initialData) {
      setCurrentData(initialData);
    }
  }, [initialData]);

  const simulateDataUpdate = useCallback(() => {
    if (!onDataUpdate || !currentData || !currentData.departments) return;

    // 랜덤한 부서 선택
    const randomDeptIndex = Math.floor(Math.random() * currentData.departments.length);
    const randomChange = (Math.random() - 0.5) * 2; // -1 to +1 점 변화

    // 새로운 데이터 생성
    const updatedData = {
      ...currentData,
      departments: currentData.departments.map((dept, index) => {
        if (index === randomDeptIndex) {
          const newScore = Math.max(60, Math.min(95, dept.score + randomChange));
          return {
            ...dept,
            score: parseFloat(newScore.toFixed(1)),
            trend: randomChange > 0 ? `+${randomChange.toFixed(1)}` : randomChange.toFixed(1)
          };
        }
        return dept;
      }),
      integrationIndex: {
        ...currentData.integrationIndex,
        lastUpdated: new Date().toISOString()
      }
    };

    // 전체 평균 재계산
    const avgScore = updatedData.departments.reduce((sum, dept) => sum + dept.score, 0) / updatedData.departments.length;
    updatedData.statistics = {
      ...(currentData.statistics || {}),
      averageScore: parseFloat(avgScore.toFixed(1))
    };

    setCurrentData(updatedData);
    onDataUpdate(updatedData);
  }, [onDataUpdate, currentData]);

  useEffect(() => {
    let interval;

    if (isRunning && currentData) {
      interval = setInterval(() => {
        simulateDataUpdate();
        setUpdateCount(prev => prev + 1);
        setLastUpdate(new Date());
      }, 3000); // 3초마다 업데이트
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, currentData, simulateDataUpdate]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setUpdateCount(0);
    setLastUpdate(null);
    if (onDataUpdate && initialData) {
      setCurrentData(initialData);
      onDataUpdate(initialData);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                실시간 데이터 시뮬레이션
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                3초마다 청렴지수 변화 시뮬레이션
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-primary hover:bg-primary-dark text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>정지</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>시작</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">초기화</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-primary">
            {isRunning ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600">LIVE</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-500">STOP</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">상태</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {updateCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">업데이트 횟수</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center col-span-2 md:col-span-1">
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {lastUpdate ? (
              lastUpdate.toLocaleTimeString('ko-KR')
            ) : (
              '업데이트 없음'
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">마지막 업데이트</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 <strong>시뮬레이션 안내:</strong> 실제 환경에서는 WebSocket이나 Server-Sent Events를 통해 
          실시간 데이터를 수신합니다. 이 기능은 데모용 시뮬레이션입니다.
        </p>
      </div>
    </div>
  );
};

LiveDataSimulator.propTypes = {
  onDataUpdate: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    integrationIndex: PropTypes.object,
    departments: PropTypes.array,
    monthlyTrends: PropTypes.array,
    statistics: PropTypes.object
  }).isRequired
};

export default LiveDataSimulator;