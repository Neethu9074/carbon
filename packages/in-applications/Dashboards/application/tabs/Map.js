import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import ApplicationMap from 'in-applications/ApplicationMap';

export default function _Map(props) {
  const { applicationId, data } = props;
  useDisabledBodyScroll();
  return (
    <FullHeightWrapper
      render={height => (
        <ApplicationMap data={data} boundaryScope={'ALL'} applicationId={applicationId} customHeight={height} />
      )}
    />
  );
}
