import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './AnalyzeTooltipContent.mless';

export default function AnalyzeTooltipContent() {
  return (
    <div className={locals.content}>
      <SvgIcon className={locals.analyzeIcon} type="lib_analyze" width={24} height={24} />
      Analyze
    </div>
  );
}
