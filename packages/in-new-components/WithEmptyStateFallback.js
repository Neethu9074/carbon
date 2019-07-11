import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ getHasDataToRender }) => ({
    hasDataToRender: getHasDataToRender().distinct()
  }),
  function WithEmptyStateFallback({ hasDataToRender = true, FallbackComponent, children, center = true }) {
    if (hasDataToRender) {
      return children;
    }

    const notFoundComponent = <EntityPageMainNotification icon="lib_missing_data" title="No data available" />;

    const content = FallbackComponent ? (
      typeof FallbackComponent === 'function' ? (
        <FallbackComponent notFoundComponent={notFoundComponent} />
      ) : (
        FallbackComponent
      )
    ) : (
      notFoundComponent
    );

    if (center) {
      return <CenterAlignmentColumn>{content}</CenterAlignmentColumn>;
    }
    return content;
  }
);
