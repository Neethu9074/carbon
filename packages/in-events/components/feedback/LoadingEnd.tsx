/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import locals from './Feedback.mless';

interface LoadingEndProps {
  currentTimeStamp: number;
}

export const LoadingEnd = ({ currentTimeStamp }: LoadingEndProps) => {
  const [loading, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (loading < 100) {
      setTimeout(() => {
        const newLoadingPercentage = ((new Date().getTime() - currentTimeStamp) / 3000) * 100;
        setLoadingProgress(newLoadingPercentage);
      }, 5);
    }
  }, [loading, currentTimeStamp]);

  return <div className={locals.loadingEnd} style={{ width: `${loading}%` }} />;
};
