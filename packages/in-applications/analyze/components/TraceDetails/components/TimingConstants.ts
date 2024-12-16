/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { themes } from '@instana/design-tokens';

import { t } from 'in-i18n';

export const TOTAL_TIME_COLOR = themes.default.ids.color.option.navy['800'];
export const NETWORK_TIME_COLOR = themes.default.ids.color.option.teal['400'];
export const SELF_TIME_COLOR = themes.default.ids.color.option.teal['400'];

export const TOTAL_TIME_LABEL = t('in-analyze:traceDetails.labelTotal');
export const NETWORK_TIME_LABEL = t('in-analyze:traceDetails.labelNetwork');
export const SELF_TIME_LABEL = t('in-analyze:traceDetails.labelSelf');
export const WAITING_TIME_LABEL = t('in-analyze:traceDetails.labelWaiting');
export const ELAPSED_TIME_LABEL = t('in-analyze:traceDetails.labelElapsed');
