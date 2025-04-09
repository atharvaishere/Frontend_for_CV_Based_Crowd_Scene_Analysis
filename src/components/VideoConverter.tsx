import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, RefreshCw, LogOut, AlertCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://crownalysis.up.railway.app/";

export default function VideoConverter() {
  const [converting, setConverting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles: File[]) => {
    const video = acceptedFiles[0];
    if (!video) return;

    // Reset all states
    setConverting(true);
    setError(null);
    setResultUrl(null);
    setVideoError(false);

    try {
      const formData = new FormData();
      formData.append('video', video);

      const response = await fetch(`${API_URL}/analyze-and-return-video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed - server error');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Verify blob is actually a video
      if (!blob.type.startsWith('video/')) {
        throw new Error('Received invalid video format');
      }

      const videoUrl = URL.createObjectURL(blob);
      setResultUrl(videoUrl);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      console.error('Video processing error:', err);
    } finally {
      setConverting(false);
    }
  };

  const handleRetry = () => {
    if (resultUrl && videoRef.current) {
      videoRef.current.load();
      setVideoError(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  return (
    <div className="w-full max-w-4xl p-8 relative z-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-12 flex justify-between items-center"
      >
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Crowd Behavior Analyzer
        </motion.h1>
        <motion.button
          onClick={handleLogout}
          className="button-style !px-4 !py-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <motion.div
        {...getRootProps()}
        className={`glass-effect rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'ring-2 ring-blue-500/50' : ''
        }`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            repeatType: "reverse"
          }}
        >
          <Upload className="mx-auto h-16 w-16 text-gray-400" />
        </motion.div>
        <p className="mt-4 text-lg text-gray-400">
          Drop your video here, or click to browse
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Supports MP4, MOV, and AVI (max 100MB)
        </p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {converting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 glass-effect rounded-xl p-8 text-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <RefreshCw className="h-12 w-12 text-blue-400" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="mt-4 text-lg text-gray-300">Analyzing your video...</p>
            <p className="text-sm text-gray-400 mt-1">
              Processing may take a few minutes
            </p>
          </motion.div>
        )}

        {resultUrl && !converting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 glass-effect rounded-xl p-8"
          >
            <motion.h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Analysis Results
            </motion.h3>
            
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                key={resultUrl}
                controls
                autoPlay
                muted
                className="w-full h-auto max-h-[70vh]"
                onError={() => setVideoError(true)}
                onCanPlay={() => setVideoError(false)}
              >
                <source src={resultUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {videoError && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                  <p className="text-red-400 font-medium text-center mb-2">
                    Video playback failed
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    The video format may not be supported in your browser
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleRetry}
                      className="button-style !px-4 !py-2"
                    >
                      Retry Playback
                    </button>
                    <a
                      href={resultUrl}
                      download="crowd-analysis-result.mp4"
                      className="button-style !px-4 !py-2 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}