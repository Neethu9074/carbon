import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ getHasDataToRender }) => ({
    hasDataToRender: getHasDataToRender().distinct()
  }),
  function WithEmptyStateFallback(props) {
    const {
      hasDataToRender = true,
      FallbackComponent,
      children,
      center = true,
      title,
      changeExplanation,
      explanation,
      fallbackComponentProps
    } = props;
    if (hasDataToRender) {
      return children;
    }

    const notFoundComponent = (
      <EntityPageMainNotification
        icon="lib_missing_data"
        title={title || 'No data available'}
        explanation={explanation}
        changeExplanation={changeExplanation}
      />
    );

    const content = FallbackComponent ? (
      typeof FallbackComponent === 'function' ? (
        <FallbackComponent notFoundComponent={notFoundComponent} {...props} {...fallbackComponentProps} />
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
