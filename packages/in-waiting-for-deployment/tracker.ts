/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  ONBOARDING_OPENED,
  ONBOARDING_INSTANA_BEGINNER_VIDEOS_CLICKED,
  ONBOARDING_HELP_AND_SUPPORT_CLICKED,
  ONBOARDING_MAIN_TOPIC_CHANGED,
  ONBOARDING_SUB_TOPIC_CHANGED,
  ONBOARDING_SEARCH_QUERY_CHANGED,
  ONBOARDING_CATALOG_PAGE_OPENED,
  ONBOARDING_AGENT_DETAILS_PAGE_OPENED,
  ONBOARDING_CATALOG_PAGE_SEARCH_USED,
  ONBOARDING_DEPLOY_AGENTS_BUTTON_CLICKED
} from 'in-services/tracking/tracking';

export default function createTracker(prefix: string) {
  prefix = prefix ? `${prefix}.` : '';
  return {
    dialogOpened: () => track(`${prefix}${ONBOARDING_OPENED}`),
    beginnerVideosClicked: () => track(`${prefix}${ONBOARDING_INSTANA_BEGINNER_VIDEOS_CLICKED}`),
    helpAndSupportClicked: () => track(`${prefix}${ONBOARDING_HELP_AND_SUPPORT_CLICKED}`),
    mainTopicChanged: (e: { [key: string]: string }) => track(`${prefix}${ONBOARDING_MAIN_TOPIC_CHANGED}`, e),
    subTopicChanged: (e: { [key: string]: string }) => track(`${prefix}${ONBOARDING_SUB_TOPIC_CHANGED}`, e),
    searchQueryChanged: (e: { [key: string]: string }) => track(`${prefix}${ONBOARDING_SEARCH_QUERY_CHANGED}`, e),
    catalogPageOpened: () => track(`${prefix}${ONBOARDING_CATALOG_PAGE_OPENED}`),
    catalogPageSearchUsed: (e: { [key: string]: string }) =>
      track(`${prefix}${ONBOARDING_CATALOG_PAGE_SEARCH_USED}`, e),
    agentDetailsPageOpened: () => track(`${prefix}${ONBOARDING_AGENT_DETAILS_PAGE_OPENED}`),
    deployAgentsButtonClicked: () => track(`${prefix}${ONBOARDING_DEPLOY_AGENTS_BUTTON_CLICKED}`)
  };
}

export type CreateTrackerProps = ReturnType<typeof createTracker>;
