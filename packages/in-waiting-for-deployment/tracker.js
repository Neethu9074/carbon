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
  ONBOARDING_SEARCH_QUERY_CHANGED
} from 'in-services/tracking/tracking';

export default function createTracker(prefix) {
  prefix = prefix ? `${prefix}.` : '';
  return {
    dialogOpened: () => track(`${prefix}${ONBOARDING_OPENED}`),
    beginnerVideosClicked: () => track(`${prefix}${ONBOARDING_INSTANA_BEGINNER_VIDEOS_CLICKED}`),
    helpAndSupportClicked: () => track(`${prefix}${ONBOARDING_HELP_AND_SUPPORT_CLICKED}`),
    mainTopicChanged: e => track(`${prefix}${ONBOARDING_MAIN_TOPIC_CHANGED}`, e),
    subTopicChanged: e => track(`${prefix}${ONBOARDING_SUB_TOPIC_CHANGED}`, e),
    searchQueryChanged: e => track(`${prefix}${ONBOARDING_SEARCH_QUERY_CHANGED}`, e)
  };
}
