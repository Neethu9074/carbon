import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ getHasDataToRender }) => ({
    hasDataToRender: getHasDataToRender().distinct()
  }),
  function WithEmptyStateFallback(props) {
    const { hasDataToRender = true, FallbackComponent, children, center = true, title, explanation } = props;
    if (hasDataToRender) {
      return children;
    }

    const notFoundComponent = (
      <EntityPageMainNotification
        icon="lib_missing_data"
        title={title || 'No data available'}
        explanation={explanation}
      />
    );

    const content = FallbackComponent ? (
      typeof FallbackComponent === 'function' ? (
        <FallbackComponent notFoundComponent={notFoundComponent} {...props} />
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
