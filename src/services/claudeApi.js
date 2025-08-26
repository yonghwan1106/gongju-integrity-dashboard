import axios from 'axios';

const CLAUDE_API_KEY = process.env.VITE_CLAUDE_API_KEY || 'YOUR_CLAUDE_API_KEY_HERE';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

class ClaudeApiService {
  constructor() {
    this.apiKey = CLAUDE_API_KEY;
    this.baseURL = CLAUDE_API_URL;
  }

  async sendMessage(prompt, systemMessage = '') {
    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          temperature: 0.1,
          system: systemMessage,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error('Claude API 호출 오류:', error);
      throw error;
    }
  }

  async analyzeTrends(monthlyData) {
    const dataString = JSON.stringify(monthlyData, null, 2);
    const systemMessage = `당신은 공주시 청렴지수 분석 전문가입니다. 객관적이고 통계적인 분석을 제공해주세요.`;
    
    const prompt = `
다음은 공주시의 월별 청렴지수 데이터입니다:

${dataString}

이 데이터를 분석하여 다음을 포함한 인사이트를 제공해주세요:
1. 전반적인 트렌드 (개선/악화)
2. 가장 변화가 큰 분야 식별
3. 주목할 만한 패턴이나 이상치
4. 향후 3개월 예측 (근거 포함)

응답은 간결하고 실무진이 이해하기 쉽게 작성해주세요.`;

    return await this.sendMessage(prompt, systemMessage);
  }

  async predictFutureScores(currentData, historicalData) {
    const systemMessage = `당신은 데이터 분석 전문가입니다. 통계적 근거를 바탕으로 예측을 수행해주세요.`;
    
    const prompt = `
현재 청렴지수 데이터:
${JSON.stringify(currentData, null, 2)}

과거 6개월 데이터:
${JSON.stringify(historicalData, null, 2)}

이 데이터를 바탕으로 향후 3개월간의 청렴지수 변화를 예측해주세요:
1. 전체 청렴지수 예측값 (월별)
2. 각 분야(계약/인사/예산)별 예측
3. 예측의 신뢰도와 주요 변수
4. 개선을 위한 권장사항

JSON 형태로 구조화된 예측 결과를 제공해주세요.`;

    return await this.sendMessage(prompt, systemMessage);
  }

  async detectAnomalies(currentScore, historicalScores) {
    const systemMessage = `당신은 이상 탐지 전문가입니다. 통계적 분석을 통해 비정상적인 패턴을 식별해주세요.`;
    
    const prompt = `
현재 청렴지수: ${currentScore}
과거 데이터: ${JSON.stringify(historicalScores)}

다음 사항을 분석해주세요:
1. 현재 점수가 정상 범위 내인지 판단
2. 급격한 변화나 이상 패턴이 있는지 확인
3. 이상이 발견된다면 가능한 원인 분석
4. 대응 방안 제안

분석 결과를 JSON 형태로 제공해주세요.`;

    return await this.sendMessage(prompt, systemMessage);
  }

  async generateMonthlyReport(departmentData, trends, statistics) {
    const systemMessage = `당신은 공주시 청렴담당 공무원을 위한 보고서 작성 전문가입니다. 공식적이고 객관적인 톤으로 작성해주세요.`;
    
    const prompt = `
부서별 데이터: ${JSON.stringify(departmentData.slice(0, 10))}
월별 트렌드: ${JSON.stringify(trends)}
주요 통계: ${JSON.stringify(statistics)}

위 데이터를 바탕으로 월간 청렴지수 분석 보고서를 작성해주세요:

1. 요약 (핵심 내용 3줄)
2. 주요 성과 및 개선 사항
3. 우려 사항 및 주의 필요 부서
4. 다음 달 중점 관리 방향
5. 권장 조치사항

보고서는 공식 문서 형태로 작성해주세요.`;

    return await this.sendMessage(prompt, systemMessage);
  }

  async answerQuestion(question, dashboardData) {
    const systemMessage = `당신은 공주시 청렴지수 대시보드의 AI 어시스턴트입니다. 사용자의 질문에 데이터를 바탕으로 정확하고 도움되는 답변을 제공해주세요.`;
    
    const prompt = `
현재 대시보드 데이터:
${JSON.stringify(dashboardData, null, 2)}

사용자 질문: "${question}"

위 데이터를 참고하여 사용자의 질문에 답변해주세요. 구체적인 수치와 근거를 포함하여 설명해주세요.`;

    return await this.sendMessage(prompt, systemMessage);
  }
}

export default new ClaudeApiService();