import React, { useState, useEffect } from 'react';

// TypeScript definition for the emerging WebNN API
declare global {
  interface Navigator {
    ml?: {
      createContext(options?: any): Promise<any>;
    };
  }
}

type WebNNStatus = 'checking' | 'supported' | 'unsupported';

const WebNNDemo: React.FC = () => {
  const [status, setStatus] = useState<WebNNStatus>('checking');
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState<string>('Awaiting on-device inference...');

  useEffect(() => {
    if (navigator.ml && typeof navigator.ml.createContext === 'function') {
      setStatus('supported');
    } else {
      setStatus('unsupported');
    }
  }, []);

  const handleRunInference = () => {
    if (status !== 'supported') {
      setOutput('Error: WebNN is not supported on this browser/device.');
      return;
    }
    setIsProcessing(true);
    setOutput('Running inference on-device via GPU/NPU...');
    
    // Simulate a client-side ML task
    setTimeout(() => {
      const mockResult = {
        "task": "In-browser Sentiment Analysis (Transformers.js)",
        "input": "The situation is complex but there is hope.",
        "output": {
          "label": "MIXED",
          "score": 0.89
        },
        "latency_ms": 45,
        "processed_on": "Client-Side Accelerator"
      };
      setOutput(JSON.stringify(mockResult, null, 2));
      setIsProcessing(false);
    }, 1500);
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'supported':
        return <div className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-[9px] font-black border border-green-500/20 uppercase">Supported & Active</div>;
      case 'unsupported':
        return <div className="px-2 py-0.5 rounded bg-red-500/20 text-red-500 text-[9px] font-black border border-red-500/20 uppercase">Unsupported</div>;
      default:
        return <div className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 text-[9px] font-black border border-yellow-500/20 uppercase">Checking...</div>;
    }
  };

  return (
    <div className="bg-white dark:bg-[#001f4d] border border-slate-200 dark:border-[#0042a5] rounded-xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">WebNN & Privacy Tools (The Edge)</h3>
        {getStatusIndicator()}
      </div>
      <p className="text-[10px] text-slate-500 dark:text-white/60 mt-1 mb-4">
        Browser-native machine learning (W3C Standard). Data stays on device.
      </p>

      <div className="flex-1 bg-slate-100 dark:bg-black/40 rounded-lg p-4 font-mono text-xs text-slate-700 dark:text-cyan-300 whitespace-pre-wrap overflow-y-auto custom-scrollbar">
        {output}
      </div>

      <button
        onClick={handleRunInference}
        disabled={isProcessing || status !== 'supported'}
        className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Processing on Device...
          </>
        ) : (
          <>
            ⚡ Run On-Device AI Task
          </>
        )}
      </button>
    </div>
  );
};

export default WebNNDemo;
