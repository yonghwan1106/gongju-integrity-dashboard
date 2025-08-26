// Mock Claude API for development and demonstration purposes
class MockClaudeApiService {
  async sendMessage(prompt, systemMessage = '') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    if (prompt.includes('월별 청렴지수 데이터')) {
      return this.generateTrendAnalysis();
    }
    
    if (prompt.includes('향후 3개월간의 청렴지수 변화를 예측')) {
      return this.generatePrediction();
    }
    
    if (prompt.includes('월간 청렴지수 분석 보고서')) {
      return this.generateMonthlyReport();
    }
    
    if (prompt.includes('어느 부서가 가장')) {
      return '분석 결과, 기획예산과가 최근 6개월간 가장 많이 개선되었습니다 (+2.3점). 특히 계약 분야에서 재공고율이 8.2%로 개선되어 전체 청렴지수 상승을 이끌었습니다.';
    }
    
    if (prompt.includes('계약 분야에서 주의할 점')) {
      return '계약 분야 분석 결과:\n\n1. 재공고율 모니터링 필요 (현재 8.2%)\n2. 업체 참여율 확대 방안 모색 (현재 85.3%)\n3. 계약변경률 관리 강화 (현재 5.1%)\n\n특히 농업기술센터와 산업경제과의 계약 투명성 개선이 시급합니다.';
    }
    
    // Default response for other questions
    return `입력하신 질문에 대한 AI 분석 결과입니다:

${prompt}

현재 공주시 청렴지수 데이터를 바탕으로 분석한 결과, 전반적으로 긍정적인 개선 추세를 보이고 있습니다. 

주요 인사이트:
- 전체 청렴지수: 78.5점 (B+ 등급)
- 상위 부서: 기획예산과, 민원봉사과, 문화관광과
- 개선이 필요한 분야: 인사 분야 투명성 강화

더 구체적인 분석이 필요하시면 구체적인 질문을 해주세요.`;
  }

  generateTrendAnalysis() {
    return `📊 공주시 청렴지수 트렌드 분석 (2025년 2월~7월)

## 1. 전반적인 트렌드
✅ **긍정적 개선세**: 6개월간 지속적인 상승 추세 (74.8점 → 78.5점)
- 총 3.7점 상승으로 월평균 0.6점씩 개선
- 특히 4월 이후 가속화된 개선 양상

## 2. 분야별 변화 분석
🏆 **계약 분야 (최우수)**
- 76.2점 → 82.1점 (5.9점 상승)
- 재공고율 개선 및 투명성 강화 성과

⚠️ **인사 분야 (개선 필요)**
- 72.1점 → 75.8점 (3.7점 상승)
- 상대적으로 더딘 개선 속도

💰 **예산 분야 (안정적)**
- 76.0점 → 77.9점 (1.9점 상승)
- 꾸준한 개선세 유지

## 3. 주목할 만한 패턴
📈 **5월 급상승**: 75.9점 → 77.1점 (1.2점 증가)
- 계약 분야 개선 정책 효과로 분석
- 시민 참여 확대 프로그램 영향

## 4. 향후 3개월 예측 (근거 기반)
🎯 **8월**: 79.2점 (±0.7점)
🎯 **9월**: 79.8점 (±0.6점) 
🎯 **10월**: 80.3점 (±0.8점)

**예측 근거**: 현재 월평균 0.6점 상승 추세와 계절적 요인 고려

## 5. 권장 사항
🔴 **즉시 조치**: 인사 분야 투명성 강화 프로그램 도입
🟡 **중기 과제**: 예산 편성 과정 시민 참여 확대
🟢 **장기 목표**: 2025년 말 85점 돌파 가능`;
  }

  generatePrediction() {
    return `{
  "predictions": {
    "nextThreeMonths": [
      {
        "month": "2025-08",
        "totalScore": 79.2,
        "contractScore": 83.4,
        "personnelScore": 76.8,
        "budgetScore": 78.5,
        "confidence": 85
      },
      {
        "month": "2025-09", 
        "totalScore": 79.8,
        "contractScore": 84.1,
        "personnelScore": 77.2,
        "budgetScore": 79.1,
        "confidence": 80
      },
      {
        "month": "2025-10",
        "totalScore": 80.3,
        "contractScore": 84.7,
        "personnelScore": 77.8,
        "budgetScore": 79.6,
        "confidence": 75
      }
    ],
    "keyFactors": [
      "계약 분야 지속적 개선 추세",
      "하반기 예산 집행 시즌 영향",
      "인사 분야 개선 정책 효과 지연"
    ],
    "riskFactors": [
      "경제 상황 변화",
      "정책 변경 가능성",
      "외부 감사 결과"
    ],
    "recommendations": [
      "인사위원회 운영 투명성 강화",
      "시민 모니터링단 확대 운영", 
      "분기별 청렴도 자가진단 실시"
    ]
  }
}`;
  }

  generateMonthlyReport() {
    return `공주시청 청렴담당관

월간 청렴지수 분석 보고서
(2025년 7월 기준)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 1. 요약
• 전체 청렴지수 78.5점으로 전월 대비 1.7점 상승
• 계약 분야 82.1점으로 최고 수준 달성, 인사 분야는 지속적 개선 필요
• 상위 3개 부서(기획예산과, 민원봉사과, 문화관광과) 모두 80점 돌파

## 2. 주요 성과 및 개선 사항

### 2-1. 우수 성과
🏆 **계약 분야 혁신적 개선**
- 재공고율 8.2%로 목표치(10% 이하) 달성
- 평균 처리일수 12.5일로 단축
- 업체 참여율 85.3%로 경쟁성 확보

🏆 **부서별 상승세**
- 기획예산과: 85.2점 (전월 대비 +2.3점)
- 민원봉사과: 82.7점 (전월 대비 +1.8점)
- 사회복지과: 73.1점 (전월 대비 +2.1점)

### 2-2. 시민 만족도 향상
- 시민 만족도 76.3점으로 안정적 유지
- 시민 참여자 수 1,247명으로 전월 대비 15% 증가

## 3. 우려 사항 및 주의 필요 부서

### 3-1. 개선 필요 부서
⚠️ **총무과 (69.2점)**
- 최하위 순위 지속, 인사 분야 70.1점으로 미흡
- 계약변경률 관리 강화 필요

⚠️ **산업경제과 (70.5점)**
- 전월 대비 -0.9점 하락
- 예산 집행 투명성 보완 요구

### 3-2. 분야별 취약점
- **인사 분야**: 전체 평균 75.8점으로 상대적 저조
- **승진 투명성**: 78.2점으로 목표치(80점) 미달

## 4. 다음 달 중점 관리 방향

### 4-1. 즉시 개선 과제
1. 총무과·산업경제과 집중 컨설팅 실시
2. 인사위원회 운영 가이드라인 재정비
3. 계약 우수사례 전 부서 확산

### 4-2. 중장기 개선 계획
1. 청렴 교육 프로그램 고도화
2. 시민 모니터링 시스템 구축
3. 분기별 자체 평가 체계 강화

## 5. 권장 조치사항

### 5-1. 긴급 조치 (8월 내)
- 하위 2개 부서 긴급 진단 및 개선방안 수립
- 인사 분야 투명성 강화 특별 점검

### 5-2. 정책 건의 (9월 내)
- 청렴지수 향상 인센티브 제도 도입 검토
- 부서간 우수사례 공유 체계 구축

## 6. 첨부자료
- 부서별 상세 분석표
- 월별 추이 그래프
- 시민 의견 수렴 결과

보고일: 2025년 8월 1일
담당: 청렴담당관실

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  async analyzeTrends(monthlyData) {
    return await this.sendMessage('월별 청렴지수 데이터 분석', 'trend analysis');
  }

  async predictFutureScores(currentData, historicalData) {
    return await this.sendMessage('향후 3개월간의 청렴지수 변화를 예측', 'prediction');
  }

  async detectAnomalies(currentScore, historicalScores) {
    const analysis = {
      isNormal: true,
      message: "현재 청렴지수는 정상 범위 내에 있습니다.",
      recommendation: "지속적인 모니터링을 권장합니다."
    };
    
    if (currentScore < 70) {
      analysis.isNormal = false;
      analysis.message = "⚠️ 청렴지수가 임계점 이하입니다.";
      analysis.recommendation = "즉시 개선 조치가 필요합니다.";
    }
    
    return JSON.stringify(analysis, null, 2);
  }

  async generateMonthlyReport(departmentData, trends, statistics) {
    return await this.sendMessage('월간 청렴지수 분석 보고서', 'report generation');
  }

  async answerQuestion(question, dashboardData) {
    return await this.sendMessage(question, 'question answering');
  }
}

export default new MockClaudeApiService();