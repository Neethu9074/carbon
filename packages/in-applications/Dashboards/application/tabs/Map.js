import React, { Fragment } from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import ApplicationMap from 'in-new-components/ApplicationMap';

export default function _Map(props) {
  const { applicationId, data } = props;
  return (
    <Fragment>
      <FullHeightWrapper
        render={height => (
          <ApplicationMap data={data} boundaryScope={'ALL'} applicationId={applicationId} customHeight={height} />
        )}
      />
      <DisabledBodyScroll />
    </Fragment>
  );
}
