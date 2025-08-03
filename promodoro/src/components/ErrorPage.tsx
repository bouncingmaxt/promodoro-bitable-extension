import React from 'react';
import { useErrorContext } from '../contexts';

interface ErrorPageProps {
  onReturnToTasks?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ onReturnToTasks }) => {
  const { error, clearError } = useErrorContext();

  const handleReturnToTasks = () => {
    clearError();
    if (onReturnToTasks) {
      onReturnToTasks();
    }
  };

  const handleRefresh = () => {
    clearError();
    window.location.reload();
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="none" />
            <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2" />
            <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2" />
          </svg>
        </div>

        <h1 className="error-title">出现错误</h1>

        <div className="error-message">
          {error || '应用程序遇到了一个未知错误'}
        </div>

        <div className="error-actions">
          <button
            className="btn btn-primary"
            onClick={handleReturnToTasks}
          >
            返回任务选择
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
          >
            刷新页面
          </button>
        </div>
      </div>

      <style>{`
        .error-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f8fafc;
        }
        
        .error-container {
          text-align: center;
          max-width: 400px;
          padding: 40px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .error-icon {
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
        }
        
        .error-title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 16px;
        }
        
        .error-message {
          color: #6b7280;
          margin-bottom: 32px;
          line-height: 1.5;
          word-break: break-word;
        }
        
        .error-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 120px;
        }
        
        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #2563eb;
        }
        
        .btn-secondary {
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        
        .btn-secondary:hover {
          background-color: #e5e7eb;
        }
        
        @media (max-width: 480px) {
          .error-container {
            padding: 24px;
          }
          
          .error-actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;