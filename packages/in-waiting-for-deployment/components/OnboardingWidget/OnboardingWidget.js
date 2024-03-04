/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import OnboardingWidgetPresenter from 'in-waiting-for-deployment/components/OnboardingWidget/OnboardingWidgetPresenter';
import OnboardingWidgetPresenterV2 from 'in-plg/pages/onboarding/OnboardingWidgetPresenterV2';
import { agentInstallationV2Enabled } from 'in-services/featureFlags';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import createTracker from 'in-waiting-for-deployment/tracker';
import useUrlState from 'in-hooks/useUrlState';

const urlStateDefinition = {
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
  ]
};

export default function OnboardingWidget(props) {
  const Renderer =
    props.Renderer || (agentInstallationV2Enabled ? OnboardingWidgetPresenterV2 : OnboardingWidgetPresenter);
  const trackingService = createTracker(props.trackingIdPrefix);
  const [{ selectedEntry, selectedSubEntry, query }, setUrlState] = useUrlState(urlStateDefinition);
  useEffect(() => {
    if (agentInstallationV2Enabled) {
      trackingService.catalogPageOpened();
    } else {
      trackingService.dialogOpened();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Renderer
        {...props}
        query={query}
        trackingService={trackingService}
        selectedSubEntryIndex={selectedSubEntry}
        selectedEntryIndex={selectedEntry}
        onEntrySelected={(index, entryLabel) => {
          setUrlState({
            selectedEntry: index,
            selectedSubEntry: null
          });
          trackingService.mainTopicChanged({ topic: entryLabel });
        }}
        onSubEntrySelected={(index, subEntryLabel) => {
          setUrlState({
            selectedSubEntry: index
          });
          trackingService.subTopicChanged({ subTopic: subEntryLabel });
        }}
        onQueryChange={query => {
          setUrlState({
            selectedEntry: 0,
            selectedSubEntry: null,
            query
          });
          trackingService.searchQueryChanged({ query });
        }}
      />
    </>
  );
}
