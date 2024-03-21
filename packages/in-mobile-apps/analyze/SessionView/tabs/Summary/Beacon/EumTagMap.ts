/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export default function MapKeyToTranslatedDisplayName(key: string) {
  return EumTags[key] ? EumTags[key]['displayName'] : null;
}

type EumTag = {
  displayName: string;
  tagName?: string;
};

type EumTagMap = {
  [key: string]: EumTag;
};

const EumTags: EumTagMap = {
  //###### FOR ANDROID ######
  'act.screen.name': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.android.activityScreenName'),
    tagName: 'activity.screen.name'
  },
  'act.class.name': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.android.activityClassName'),
    tagName: 'activity.class.name'
  },
  'act.local.path.name': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.android.activityLocalPathName'),
    tagName: 'activity.local.path.name'
  },
  'frag.screen.name': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.android.fragmentScreenName'),
    tagName: 'fragment.screen.name'
  },
  'frag.class.name': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.android.fragmentClassName'),
    tagName: 'fragment.class.name'
  },
  'frag.local.path.name': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.android.fragmentLocalPathName'),
    tagName: 'fragment.local.path.name'
  },
  'frag.active.screen.list': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.android.activeFragmentList'),
    tagName: 'active.fragment.list'
  },
  'act.created.time': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.android.activityCreatedTime'),
    tagName: 'activity.created.time'
  },
  'frag.resume.time': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.android.fragmentResumeTime'),
    tagName: 'fragment.created.time'
  },

  //###### FOR IOS ######
  'view.accLabel': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.ios.accessibilityLabel'),
    tagName: 'view.accLabel'
  },
  'view.navItemTitle': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.ios.navigationItemTitle'),
    tagName: 'view.navItemTitle'
  },
  'view.clsName': {
    displayName: t('in-mobile-apps:analyzeView.eumTags.viewTransition.ios.className'),
    tagName: 'view.clsName'
  }
};
