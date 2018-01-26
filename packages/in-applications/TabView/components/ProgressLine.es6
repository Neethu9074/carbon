import React from 'react';

import locals from './ProgressLine.mless';

export default function ProgressLine({ result }) {
  const isLoading = result.progress.loading;
  const percentage = result.progress.percentage || 0;
  const hasErrors = result.errors.length > 0;

  return (
    <div className={locals.progressLineWrapper}>
      {isLoading && !hasErrors ? (
        <div style={{ width: `${percentage * 100}%` }} className={locals.progressLine} />
      ) : null}
      {hasErrors ? <div style={{ width: '100%' }} className={`${locals.progressLine} ${locals.errorLine}`} /> : null}
    </div>
  );
}
