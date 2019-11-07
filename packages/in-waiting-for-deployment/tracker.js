import {
  track,
  ONBOARDING_INSTANA_BEGINNER_VIDEOS_CLICKED,
  ONBOARDING_HELP_AND_SUPPORT_CLICKED,
  ONBOARDING_MAIN_TOPIC_CHANGED,
  ONBOARDING_SUB_TOPIC_CHANGED,
  ONBOARDING_SEARCH_QUERY_CHANGED
} from 'in-services/tracking/tracking';

export default function createTracker(prefix) {
  prefix = prefix ? `${prefix}.` : '';
  return {
    beginnerVideosClicked: () => track(`${prefix}${ONBOARDING_INSTANA_BEGINNER_VIDEOS_CLICKED}`),
    helpAndSupportClicked: () => track(`${prefix}${ONBOARDING_HELP_AND_SUPPORT_CLICKED}`),
    mainTopicChanged: entryLabel => track(`${prefix}${ONBOARDING_MAIN_TOPIC_CHANGED}`, entryLabel),
    subTopicChanged: subEntryLabel => track(`${prefix}${ONBOARDING_SUB_TOPIC_CHANGED}`, subEntryLabel),
    searchQueryChanged: query => track(`${prefix}${ONBOARDING_SEARCH_QUERY_CHANGED}`, query)
  };
}
