/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { isValidElement } from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import EntityPageMainNotification, {
  EntityPageMainNotificationProps
} from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { t } from 'in-i18n';

interface FallbackComponentProps {
  notFoundComponent: React.ReactNode;
  type?: string;
}

interface Props extends Pick<EntityPageMainNotificationProps, 'title' | 'explanation' | 'changeExplanation'> {
  getHasDataToRender?: () => Observable<boolean>;
  center?: boolean;
  type?: string;
  FallbackComponent?: (props: FallbackComponentProps) => JSX.Element;
}

export default function WithEmptyStateFallback(props: React.PropsWithChildren<Props>) {
  const {
    FallbackComponent,
    children,
    center = true,
    title,
    changeExplanation,
    explanation,
    getHasDataToRender
  } = props;
  const hasDataToRender = useObservable(getHasDataToRender?.().distinct(), [getHasDataToRender]);
  if (hasDataToRender) {
    return children;
  }

  const notFoundComponent = (
    <EntityPageMainNotification
      icon="lib_missing_data"
      title={title || t('in-components:withEmptyStateFallbackTitleNoDataAvailable')}
      explanation={explanation}
      changeExplanation={changeExplanation}
    />
  );

  let content: React.ReactNode;
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
      content = <FallbackComponent notFoundComponent={notFoundComponent} type={props.type} />;
    }
  } else {
    content = notFoundComponent;
  }

  if (center) {
    return <CenterAlignmentColumn>{content}</CenterAlignmentColumn>;
  }
  return content;
}
