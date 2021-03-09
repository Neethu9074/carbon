/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t, Trans } from 'in-i18n';
import React from 'react';

export default {
  nodejs_collector_initialized_too_late: {
    issueDescription: {
      Component: function nodejsCollectorInitializedTooLate() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.nodeJsRuntimePlatform.tracingMightOnlyWorkPartiallyWithThisSetup" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.nodeJsRuntimePlatform.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/node-js/#nodejs_collector_initialized_too_late`
  },
  nodejs_collector_native_addon_autoprofile_missing: {
    issueDescription: {
      Component: function nodejsCollectorNativeAddonAutoProfileMissing() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.nodeJsRuntimePlatform.youWillNotGetProfilingInformationForThisNodeJsApp" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.nodeJsRuntimePlatform.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/node-js/#nodejs_collector_native_addon_autoprofile_missing`
  }
};
