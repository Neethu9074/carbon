import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { dataSource as dataSourceMatrixParameter } from 'in-analyze/navigation/matrix';
import DropDown from 'in-new-components/DropDown';
import SvgIcon from 'in-components/SvgIcon';

import locals from './AnalyzeHeader.mless';

export default function AnalyzeHeader({ dataSource, onChangeFilters }) {
  return (
    <div className={locals.headerWrapper}>
      <MaxWidthFullscreenContainer>
        <div className={locals.header}>
          <DropDown
            numItems={1}
            renderItem={() => (dataSource === 'traces' ? 'calls' : 'traces')}
            onClick={() => {
              const newState = {};
              newState[dataSourceMatrixParameter] = dataSource === 'traces' ? 'calls' : 'traces';
              onChangeFilters(newState);
            }}
          >
            <SvgIcon className={locals.analyzeIcon} type="lib_analyze" width={24} />
            <span className={locals.label}>{dataSource}</span>
          </DropDown>
        </div>
      </MaxWidthFullscreenContainer>
    </div>
  );
}
