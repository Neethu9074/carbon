/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  clr_env_var_not_defined: {
    issueDescription: {
      Component: function clrEnvVarNotDefined({ missingEnvKeys }) {
        const missing = Array.isArray(missingEnvKeys) ? missingEnvKeys.join(', ') : missingEnvKeys;
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.clrRuntimePlatform.theFollowingEnvironmentVariablesMustBeSetOnTheNetCoreProcess"
              values={{ missing }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.clrRuntimePlatform.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net/#clr_env_var_not_defined`
  },
  clr_env_var_invalid_value: {
    issueDescription: {
      Component: function clrEnvVarInvalidValue({ invalidEnvKey, invalidEnvValue, competitor }) {
        if (competitor) {
          return (
            <span>
              <Trans
                i18nKey="in-forge:plugins.clrRuntimePlatform.detectedThisBasedOnTheValueOfTheInvalidEnvKeyEnvironmentVariable"
                values={{ competitor, invalidEnvKey }}
              />
            </span>
          );
        }

        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.clrRuntimePlatform.theEnvironmentVariableInvalidEnvKeyHasTheWrongValue"
              values={{ invalidEnvKey, invalidEnvValue }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.clrRuntimePlatform.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net/#clr_env_var_invalid_value`
  }
};
