import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getLinkToGroupedData } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import Sticky from 'in-components/Sticky';

import locals from './RawDataView.mless';

export default function RawDataView(props) {
  const { rawListComponent: RawListComponent, filterByGroup } = props;

  return (
    <Sticky
      header={
        <div className={locals.headerWrapper}>
          <MaxWidthFullscreenContainer className={locals.header}>
            <Button
              className={locals.button}
              href$={getLinkToGroupedData()}
              size="compact"
              icon="lib_arrow_left"
              kind="secondary"
            >
              Analyze
            </Button>

            {filterByGroup && <span className={locals.groupName}>Group: {filterByGroup.value}</span>}
          </MaxWidthFullscreenContainer>
        </div>
      }
    >
      <MaxWidthFullscreenContainer>{filterByGroup && <RawListComponent {...props} />}</MaxWidthFullscreenContainer>
    </Sticky>
  );
}
