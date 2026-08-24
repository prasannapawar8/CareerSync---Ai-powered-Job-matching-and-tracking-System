'use client';

import React, { useState, useRef } from 'react';

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; textPreview?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        alert('Please upload a valid PDF file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult({ success: true, message: data.message, textPreview: data.textPreview });
      } else {
        setResult({ success: false, message: data.error || 'Upload failed' });
      }
    } catch (error) {
      setResult({ success: false, message: 'An unexpected error occurred' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="application/pdf"
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center gap-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <div className="text-gray-600">
            {file ? (
              <span className="font-semibold text-blue-600">{file.name}</span>
            ) : (
              <span>
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">PDF documents only</p>
        </div>
      </div>

      {file && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors
              ${isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isUploading ? 'Uploading & Parsing...' : 'Upload Resume'}
          </button>
        </div>
      )}

      {result && (
        <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.message}
          </h3>
          {result.textPreview && (
            <div className="mt-4 text-left">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Parsed Text Preview:</h4>
              <div className="bg-white p-3 rounded border text-sm text-gray-600 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {result.textPreview}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
