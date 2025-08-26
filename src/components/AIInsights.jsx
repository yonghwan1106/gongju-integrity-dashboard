import React, { useState, useEffect } from 'react';
import { Bot, TrendingUp, AlertTriangle, FileText, MessageSquare, Loader, Calendar, Target, CheckCircle, XCircle, AlertCircle, BarChart3 } from 'lucide-react';
// import claudeApi from '../services/claudeApi'; // CORS 이슈로 임시 비활성화
import claudeApi from '../services/mockClaudeApi'; // 시연용 Mock API
import { formatScore } from '../utils/formatters';
import { calculateGrade, getGradeColor } from '../utils/calculations';

const PredictionDisplay = ({ predictions }) => {
  let parsedData;
  
  try {
    parsedData = typeof predictions === 'string' ? JSON.parse(predictions) : predictions;
  } catch (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">예측 데이터 파싱 중 오류가 발생했습니다.</span>
        </div>
      </div>
    );
  }

  const { nextThreeMonths, keyFactors, riskFactors, recommendations } = parsedData.predictions;

  return (
    <div className="space-y-6">
      {/* 3개월 예측 차트 */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h5 className="text-lg font-semibold">3개월 예측 점수</h5>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {nextThreeMonths.map((monthData, index) => {
            const grade = calculateGrade(monthData.totalScore);
            const gradeColor = getGradeColor(grade);
            
            return (
              <div key={monthData.month} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-800">
                      {new Date(monthData.month).toLocaleDateString('ko-KR', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium grade-display ${gradeColor}`}>
                    {grade}
                  </span>
                </div>
                
                <div className="text-2xl font-bold text-primary mb-2">
                  {formatScore(monthData.totalScore)}점
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">계약:</span>
                    <span className="font-medium">{formatScore(monthData.contractScore)}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">인사:</span>
                    <span className="font-medium">{formatScore(monthData.personnelScore)}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">예산:</span>
                    <span className="font-medium">{formatScore(monthData.budgetScore)}점</span>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">신뢰도:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            monthData.confidence >= 80 ? 'bg-green-500' : 
                            monthData.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${monthData.confidence}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{monthData.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 예측 추세 시각화 */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-medium">예상 추세</span>
            </div>
            <div className="flex items-center space-x-4">
              {nextThreeMonths.map((month, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-primary' : 
                    index === 1 ? 'bg-secondary' : 'bg-accent'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {formatScore(month.totalScore)}점
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 핵심 요인 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h5 className="text-lg font-semibold">긍정적 요인</h5>
          </div>
          <ul className="space-y-2">
            {keyFactors.map((factor, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h5 className="text-lg font-semibold">위험 요인</h5>
          </div>
          <ul className="space-y-2">
            {riskFactors.map((factor, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 권장 조치사항 */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h5 className="text-lg font-semibold">권장 조치사항</h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-sm text-blue-800">{recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AIInsights = ({ data }) => {
  const [insights, setInsights] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questionLoading, setQuestionLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const trendAnalysis = await claudeApi.analyzeTrends(data.monthlyTrends);
      setInsights(trendAnalysis);
    } catch (error) {
      console.error('인사이트 생성 실패:', error);
      setInsights('인사이트를 생성하는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const generatePredictions = async () => {
    setLoading(true);
    try {
      const prediction = await claudeApi.predictFutureScores(
        data.integrationIndex,
        data.monthlyTrends
      );
      setPredictions(prediction);
    } catch (error) {
      console.error('예측 생성 실패:', error);
      setPredictions('예측을 생성하는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const report = await claudeApi.generateMonthlyReport(
        data.departments,
        data.monthlyTrends,
        data.statistics
      );
      setMonthlyReport(report);
    } catch (error) {
      console.error('보고서 생성 실패:', error);
      setMonthlyReport('보고서를 생성하는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestion = async () => {
    if (!question.trim()) return;
    
    setQuestionLoading(true);
    try {
      const response = await claudeApi.answerQuestion(question, data);
      setAnswer(response);
    } catch (error) {
      console.error('질문 답변 실패:', error);
      setAnswer('답변을 생성하는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setQuestionLoading(false);
    }
  };

  const tabs = [
    { id: 'insights', label: 'AI 인사이트', icon: Bot },
    { id: 'predictions', label: '예측 분석', icon: TrendingUp },
    { id: 'report', label: '월간 보고서', icon: FileText },
    { id: 'chat', label: 'AI 질의응답', icon: MessageSquare }
  ];

  const TabButton = ({ tab, isActive, onClick }) => {
    const Icon = tab.icon;
    return (
      <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isActive 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{tab.label}</span>
      </button>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Claude AI 분석</h3>
            <p className="text-sm text-gray-600">인공지능 기반 청렴지수 분석 및 예측</p>
            <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mt-1">
              💡 시연용: CORS 이슈로 Mock AI 응답 사용 중
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {activeTab === 'insights' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">트렌드 분석 인사이트</h4>
            <button
              onClick={generateInsights}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
              <span>{loading ? '분석 중...' : '인사이트 생성'}</span>
            </button>
          </div>
          
          {insights ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {insights}
              </pre>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>AI 인사이트를 생성하려면 버튼을 클릭하세요</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'predictions' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">3개월 예측 분석</h4>
            <button
              onClick={generatePredictions}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
              <span>{loading ? '예측 중...' : '예측 생성'}</span>
            </button>
          </div>
          
          {predictions ? (
            <PredictionDisplay predictions={predictions} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>AI 예측 분석을 생성하려면 버튼을 클릭하세요</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'report' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">AI 생성 월간 보고서</h4>
            <button
              onClick={generateReport}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span>{loading ? '생성 중...' : '보고서 생성'}</span>
            </button>
          </div>
          
          {monthlyReport ? (
            <div className="bg-white border p-6 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                {monthlyReport}
              </pre>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>AI 생성 보고서를 만들려면 버튼을 클릭하세요</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'chat' && (
        <div>
          <h4 className="text-lg font-semibold mb-4">AI에게 질문하기</h4>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 어느 부서가 가장 많이 개선됐나요?"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleQuestion()}
              />
              <button
                onClick={handleQuestion}
                disabled={questionLoading || !question.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {questionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                <span>{questionLoading ? '답변 중...' : '질문하기'}</span>
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-2">💡 추천 질문:</h5>
              <div className="flex flex-wrap gap-2">
                {[
                  '가장 개선이 필요한 부서는?',
                  '계약 분야에서 주의할 점은?',
                  '전체적인 트렌드는 어떤가요?',
                  '시민 만족도와 청렴지수의 관계는?'
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuestion(q)}
                    className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {answer && (
              <div className="bg-white border p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Bot className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h6 className="font-medium text-gray-800 mb-2">AI 답변:</h6>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {answer}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;