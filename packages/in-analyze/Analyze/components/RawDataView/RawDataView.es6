import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import BackToGroupButton from 'in-analyze/Analyze/components/BackToGroupButton';
import RawCalls from 'in-analyze/RawCalls';
import Sticky from 'in-components/Sticky';

import locals from './RawDataView.mless';

export default function RawDataView(props) {
  const { filterByGroup } = props;

  return (
    <Sticky
      header={
        <div className={locals.headerWrapper}>
          <MaxWidthFullscreenContainer className={locals.header}>
            <BackToGroupButton />
            {filterByGroup && <span className={locals.groupName}>Group: {filterByGroup.value}</span>}
          </MaxWidthFullscreenContainer>
        </div>
      }
    >
      <MaxWidthFullscreenContainer>{filterByGroup && <RawCalls {...props} />}</MaxWidthFullscreenContainer>
    </Sticky>
  );
}
