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
  //###### FOR WEASEL ######
  'view.title': {
    displayName: t('in-websites:analyze.analyzeView.eumTags.pageTransition.title'),
    tagName: 'view.title'
  },
  'view.url': {
    displayName: t('in-websites:analyze.analyzeView.eumTags.pageTransition.url'),
    tagName: 'view.url'
  }
};
