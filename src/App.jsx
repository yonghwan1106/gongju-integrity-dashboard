import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="App">
          <Dashboard />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;