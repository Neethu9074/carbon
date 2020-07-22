import React, { Fragment } from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import ApplicationMap from 'in-new-components/ApplicationMap';

export default function _Map(props) {
  const { boundaryScope: urlBoundaryScope, applicationId, data } = props;
  const boundaryScope = urlBoundaryScope || data.boundaryScope;
  return (
    <Fragment>
      <FullHeightWrapper
        render={height => (
          <ApplicationMap
            data={data}
            boundaryScope={boundaryScope}
            applicationId={applicationId}
            customHeight={height}
          />
        )}
      />
      <DisabledBodyScroll />
    </Fragment>
  );
}
