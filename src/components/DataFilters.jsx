import React, { useState } from 'react';
import { Filter, Calendar, Building, BarChart3, X } from 'lucide-react';

const DataFilters = ({ data, onFilterChange, activeFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: activeFilters.dateRange || 'all',
    departments: activeFilters.departments || [],
    scoreRange: activeFilters.scoreRange || { min: 0, max: 100 },
    category: activeFilters.category || 'all'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      dateRange: 'all',
      departments: [],
      scoreRange: { min: 0, max: 100 },
      category: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const toggleDepartment = (deptId) => {
    const newDepartments = filters.departments.includes(deptId)
      ? filters.departments.filter(id => id !== deptId)
      : [...filters.departments, deptId];
    handleFilterChange('departments', newDepartments);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange !== 'all') count++;
    if (filters.departments.length > 0) count++;
    if (filters.scoreRange.min > 0 || filters.scoreRange.max < 100) count++;
    if (filters.category !== 'all') count++;
    return count;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-800">데이터 필터</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>초기화</span>
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              showFilters ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showFilters ? '접기' : '펼치기'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 기간 필터 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              <span>기간</span>
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">전체 기간</option>
              <option value="recent3">최근 3개월</option>
              <option value="recent6">최근 6개월</option>
              <option value="thisYear">올해</option>
            </select>
          </div>

          {/* 부서 필터 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4" />
              <span>부서 선택</span>
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
              {data.departments?.slice(0, 8).map((dept) => (
                <label
                  key={dept.id}
                  className="flex items-center space-x-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.departments.includes(dept.id)}
                    onChange={() => toggleDepartment(dept.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 truncate">{dept.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 점수 범위 필터 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>점수 범위</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.scoreRange.min}
                  onChange={(e) => handleFilterChange('scoreRange', {
                    ...filters.scoreRange,
                    min: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="최소"
                />
                <span className="text-gray-500">~</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.scoreRange.max}
                  onChange={(e) => handleFilterChange('scoreRange', {
                    ...filters.scoreRange,
                    max: parseInt(e.target.value) || 100
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="최대"
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.scoreRange.min}
                onChange={(e) => handleFilterChange('scoreRange', {
                  ...filters.scoreRange,
                  min: parseInt(e.target.value)
                })}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>분야</span>
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">전체 분야</option>
              <option value="contract">계약</option>
              <option value="personnel">인사</option>
              <option value="budget">예산</option>
            </select>
          </div>
        </div>
      )}

      {/* 활성 필터 표시 */}
      {getActiveFiltersCount() > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium text-gray-700">활성 필터:</span>
            <div className="flex flex-wrap gap-2">
              {filters.dateRange !== 'all' && (
                <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs">
                  기간: {filters.dateRange === 'recent3' ? '최근 3개월' : 
                         filters.dateRange === 'recent6' ? '최근 6개월' : 
                         filters.dateRange === 'thisYear' ? '올해' : filters.dateRange}
                </span>
              )}
              {filters.departments.length > 0 && (
                <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs">
                  부서: {filters.departments.length}개 선택
                </span>
              )}
              {(filters.scoreRange.min > 0 || filters.scoreRange.max < 100) && (
                <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs">
                  점수: {filters.scoreRange.min}-{filters.scoreRange.max}
                </span>
              )}
              {filters.category !== 'all' && (
                <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs">
                  분야: {filters.category === 'contract' ? '계약' : 
                         filters.category === 'personnel' ? '인사' : 
                         filters.category === 'budget' ? '예산' : filters.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFilters;