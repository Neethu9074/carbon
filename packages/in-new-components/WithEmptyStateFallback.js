/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { isValidElement } from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
        title={title || t('in-new-components:withEmptyStateFallbackTitleNoDataAvailable')}
        explanation={explanation}
        changeExplanation={changeExplanation}
      />
    );

    let content;
    if (FallbackComponent) {
      if (isValidElement(FallbackComponent)) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.error(
            'Wrong usage of WithEmptyStateFallback. FallbackComponent must be a component and not a React element.'
          );
        }
        content = FallbackComponent;
      } else {
        content = (
          <FallbackComponent notFoundComponent={notFoundComponent} type={props.type} {...fallbackComponentProps} />
        );
      }
    } else {
      content = notFoundComponent;
    }

    if (center) {
      return <CenterAlignmentColumn>{content}</CenterAlignmentColumn>;
    }
    return content;
  }
);
