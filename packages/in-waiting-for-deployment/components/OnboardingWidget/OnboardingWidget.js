/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose } from 'recompose';
import React from 'react';

import OnboardingWidgetPresenter from 'in-waiting-for-deployment/components/OnboardingWidget/OnboardingWidgetPresenter';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import LifecycleObserver from 'in-components/LifecycleObserver';
import createTracker from 'in-waiting-for-deployment/tracker';
import withUrlState from 'in-hoc/withUrlState';

export default compose(
  withUrlState({
    bind: [
      {
        path: '/installation',
        name: 'selectedEntry',
        parser: intParser,
        initialState: 0
      },
      {
        path: '/installation',
        name: 'selectedSubEntry',
        parser: intParser,
        initialState: 0
      },
      {
        path: '/installation',
        name: 'query',
        initialState: ''
      }
    ],
    reducerName: 'onChange'
  })
)(OnboardingWidget);
function OnboardingWidget(props) {
  const Renderer = props.Renderer || OnboardingWidgetPresenter;
  const trackingService = createTracker(props.trackingIdPrefix);

  return (
    <>
      <LifecycleObserver onWillMount={trackingService.dialogOpened} />
      <Renderer
        {...props}
        trackingService={trackingService}
        selectedSubEntryIndex={props.selectedSubEntry}
        selectedEntryIndex={props.selectedEntry}
        onEntrySelected={(index, entryLabel) => {
          props.onChange({ selectedEntry: index, selectedSubEntry: null });
          trackingService.mainTopicChanged({ topic: entryLabel });
        }}
        onSubEntrySelected={(index, subEntryLabel) => {
          props.onChange({ selectedSubEntry: index });
          trackingService.subTopicChanged({ subTopic: subEntryLabel });
        }}
        onQueryChange={query => {
          props.onChange({ query, selectedEntry: 0, selectedSubEntry: null });
          trackingService.searchQueryChanged({ query });
        }}
      />
    </>
  );
}
