// src/components/MessageDisplay.tsx
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface MessageDisplayProps {
  errorMessage: string;
  successMessage: string;
  onClearError: () => void;
  onClearSuccess: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  errorMessage,
  successMessage,
  onClearError,
  onClearSuccess
}) => {
  if (!errorMessage && !successMessage) return null;

  return (
    <div className="fixed z-50 max-w-md top-4 right-4">
      {errorMessage && (
        <div className="flex items-center p-4 mb-2 text-red-800 bg-red-100 border border-red-200 rounded-lg shadow-lg">
          <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
          <button
            onClick={onClearError}
            className="ml-3 text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center p-4 text-green-800 bg-green-100 border border-green-200 rounded-lg shadow-lg">
          <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
          <button
            onClick={onClearSuccess}
            className="ml-3 text-green-600 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageDisplay;
