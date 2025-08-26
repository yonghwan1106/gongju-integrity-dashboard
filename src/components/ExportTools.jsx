import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Bookmark, Share2, Printer } from 'lucide-react';
import { formatDate, formatScore } from '../utils/formatters';

const ExportTools = ({ data }) => {
  const [bookmarks, setBookmarks] = useState([]);

  const exportToCSV = () => {
    const csvData = data.departments.map(dept => ({
      '부서명': dept.name,
      '청렴지수': dept.score,
      '순위': dept.rank,
      '변화율': dept.trend,
      '직원수': dept.employees,
      '계약분야': dept.categories.contract,
      '인사분야': dept.categories.personnel,
      '예산분야': dept.categories.budget
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `공주시_청렴지수_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const printContent = generatePrintContent();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>공주시 청렴지수 대시보드 리포트</title>
          <style>
            body { font-family: 'Noto Sans KR', sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #2E7D32; padding-bottom: 20px; margin-bottom: 30px; }
            .score-box { display: inline-block; padding: 10px 20px; background: #f0f9f0; border-radius: 8px; margin: 10px; }
            .department-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .department-table th, .department-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            .department-table th { background-color: #2E7D32; color: white; }
            .trend-up { color: green; } .trend-down { color: red; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const generatePrintContent = () => {
    const { integrationIndex, departments, statistics } = data;
    
    return `
      <div class="header">
        <h1>공주시 청렴지수 대시보드</h1>
        <h2>청렴 공주 온도계</h2>
        <p>2025년 공주시 청렴시책 아이디어 공모전 출품작</p>
        <p>생성일: ${formatDate(new Date().toISOString())}</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h3>전체 청렴지수 현황</h3>
        <div class="score-box">
          <h2>${formatScore(integrationIndex.totalScore)}점 (${integrationIndex.grade})</h2>
        </div>
        <div class="score-box">
          <strong>계약분야:</strong> ${formatScore(integrationIndex.categories.contract.score)}점
        </div>
        <div class="score-box">
          <strong>인사분야:</strong> ${formatScore(integrationIndex.categories.personnel.score)}점
        </div>
        <div class="score-box">
          <strong>예산분야:</strong> ${formatScore(integrationIndex.categories.budget.score)}점
        </div>
      </div>
      
      <h3>부서별 청렴지수 순위</h3>
      <table class="department-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>부서명</th>
            <th>청렴지수</th>
            <th>변화율</th>
            <th>직원수</th>
          </tr>
        </thead>
        <tbody>
          ${departments.map(dept => `
            <tr>
              <td>${dept.rank}</td>
              <td>${dept.name}</td>
              <td>${formatScore(dept.score)}</td>
              <td class="${dept.trend.startsWith('+') ? 'trend-up' : 'trend-down'}">${dept.trend}%</td>
              <td>${dept.employees}명</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <h3>주요 통계</h3>
        <ul>
          <li>전체 부서 수: ${statistics.totalDepartments}개</li>
          <li>평균 청렴지수: ${formatScore(statistics.averageScore)}점</li>
          <li>전체 개선률: ${statistics.improvementRate}</li>
          <li>시민 만족도: ${formatScore(integrationIndex.citizenSatisfaction)}점</li>
        </ul>
      </div>
    `;
  };

  const addBookmark = () => {
    const bookmark = {
      id: Date.now(),
      name: `청렴지수 현황 - ${new Date().toLocaleDateString('ko-KR')}`,
      data: data,
      timestamp: new Date().toISOString()
    };
    
    const newBookmarks = [...bookmarks, bookmark];
    setBookmarks(newBookmarks);
    localStorage.setItem('dashboard-bookmarks', JSON.stringify(newBookmarks));
  };

  const shareData = async () => {
    const shareText = `공주시 청렴지수 현황
전체 점수: ${formatScore(data.integrationIndex.totalScore)}점 (${data.integrationIndex.grade})
1위: ${data.departments[0].name} (${formatScore(data.departments[0].score)}점)
평균 점수: ${formatScore(data.statistics.averageScore)}점

#공주시 #청렴지수 #투명행정`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '공주시 청렴지수 대시보드',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('공유 실패:', error);
        fallbackShare(shareText);
      }
    } else {
      fallbackShare(shareText);
    }
  };

  const fallbackShare = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('클립보드에 복사되었습니다!');
    }).catch(() => {
      alert('공유하기를 사용할 수 없습니다.');
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Download className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-800">내보내기 & 도구</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={exportToCSV}
          className="flex flex-col items-center space-y-2 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors"
        >
          <FileSpreadsheet className="w-6 h-6 text-green-600" />
          <span className="text-sm font-medium text-gray-700">CSV 내보내기</span>
        </button>

        <button
          onClick={exportToPDF}
          className="flex flex-col items-center space-y-2 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors"
        >
          <FileText className="w-6 h-6 text-red-600" />
          <span className="text-sm font-medium text-gray-700">PDF 출력</span>
        </button>

        <button
          onClick={addBookmark}
          className="flex flex-col items-center space-y-2 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors"
        >
          <Bookmark className="w-6 h-6 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">북마크 추가</span>
        </button>

        <button
          onClick={shareData}
          className="flex flex-col items-center space-y-2 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors"
        >
          <Share2 className="w-6 h-6 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">공유하기</span>
        </button>
      </div>

      {bookmarks.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">저장된 북마크</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="text-sm font-medium text-gray-800">{bookmark.name}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(bookmark.timestamp)}
                  </div>
                </div>
                <button
                  onClick={() => setBookmarks(bookmarks.filter(b => b.id !== bookmark.id))}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 CSV 파일은 Excel에서, PDF는 상세 분석 리포트로 활용하세요
        </p>
      </div>
    </div>
  );
};

export default ExportTools;