/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t, Trans } from 'in-i18n';
import React from 'react';

export default {
  // This event happens when we have already checked all env vars, including the
  // DOTNET_STARTUP_HOOKS, and still the .NET Core application is not announcing itself.
  netcore_sensor_not_connected: {
    issueDescription: {
      Component: function netCoreSensorNotConnected() {
        return (
          <span>
            {t('in-forge:plugins.netCoreRuntimePlatform.theNetCoreApplicationHasNotGottenInContactWithTheHostAgen')}
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.netCoreRuntimePlatform.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net-core/#netcore_sensor_not_connected`
  },
  netcore_env_var_not_defined: {
    issueDescription: {
      Component: function netCoreEnvVarNotDefined({ missingEnvKeys }) {
        const missing = Array.isArray(missingEnvKeys) ? missingEnvKeys.join(', ') : missingEnvKeys;
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.netCoreRuntimePlatform.theFollowingEnvironmentVariablesMustBeSetOnTheNetCoreProcess"
              values={{ missing }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.netCoreRuntimePlatform.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net-core/#netcore_env_var_not_defined`
  },
  netcore_env_var_invalid_value: {
    issueDescription: {
      Component: function netCoreEnvVarInvalidValue({ invalidEnvKey, invalidEnvValue, competitor }) {
        if (competitor) {
          return (
            <span>
              <Trans
                i18nKey="in-forge:plugins.netCoreRuntimePlatform.itSeemsThatAnotherToolIsMonitoringThisNetCoreProcess"
                values={{ competitor, invalidEnvKey }}
              />
            </span>
          );
        }

        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.netCoreRuntimePlatform.theEnvironmentVariableHasTheWrongValueOnTheNetCoreProcess"
              values={{ invalidEnvKey, invalidEnvValue }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.netCoreRuntimePlatform.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net-core/#netcore_env_var_invalid_value`
  }
};
