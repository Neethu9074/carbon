/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { t } from 'in-i18n';

export const staticOrAdaptiveThresholds = {
  static: 'STATIC',
  adaptive: 'ADAPTIVE',

  info: {
    STATIC: {
      title: t('in-alerting:smartAlerts.applications.advanced.staticOrAdaptive.config.static.title'),
      icon: 'lib_alerting_threshold_icon',
      featureFeedbackLink: undefined,
      description: t('in-alerting:smartAlerts.applications.advanced.staticOrAdaptive.config.static.description')
    },
    ADAPTIVE: {
      title: t('in-alerting:smartAlerts.applications.advanced.staticOrAdaptive.config.adaptive.title'),
      icon: 'lib_alerting_adaptive_threshold_icon',
      featureFeedbackLink: 'https://forms.gle/bscqinv1njxKnhUm7',
      description: t('in-alerting:smartAlerts.applications.advanced.staticOrAdaptive.config.adaptive.description')
    }
  }
} as const;

export const tearSheetStaticOrAdaptiveThresholds = {
  static: 'STATIC',
  adaptive: 'ADAPTIVE',

  info: {
    STATIC: {
      title: t('in-alerting:smartAlerts.applications.advanced.staticOrAdaptive.config.static.title'),
      icon: '',
      featureFeedbackLink: undefined,
      description: t('in-alerting:smartAlerts.applications.tearSheet.staticOrAdaptive.config.static.description')
    },
    ADAPTIVE: {
      title: t('in-alerting:smartAlerts.applications.advanced.staticOrAdaptive.config.adaptive.title'),
      icon: '',
      featureFeedbackLink: undefined,
      description: t('in-alerting:smartAlerts.applications.tearSheet.staticOrAdaptive.config.adaptive.description')
    }
  }
} as const;

export type StaticOrAdaptiveType =
  | typeof staticOrAdaptiveThresholds.adaptive
  | typeof staticOrAdaptiveThresholds.static;
