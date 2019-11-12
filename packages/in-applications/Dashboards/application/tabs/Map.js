import React, { Fragment } from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import ApplicationMap from 'in-new-components/ApplicationMap';

export default function _Map({ applicationId, boundaryScope }) {
  return (
    <Fragment>
      <FullHeightWrapper
        render={height => (
          <ApplicationMap applicationId={applicationId} boundaryScope={boundaryScope} customHeight={height} />
        )}
      />
      <DisabledBodyScroll />
    </Fragment>
  );
}
