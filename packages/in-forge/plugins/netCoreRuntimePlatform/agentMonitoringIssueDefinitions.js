import React from 'react';

export default {
  // This event happens when we have already checked all env vars, including the
  // DOTNET_STARTUP_HOOKS, and still the .NET Core application is not announcing itself.
  netcore_sensor_not_connected: {
    issueDescription: {
      Component: function netCoreSensorNotConnected() {
        return (
          <span>
            The .NET Core application has not gotten in contact with the host agent. Likely there is some network
            connectivity issue between the .NET Core application and the host agent.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net-core/#netcore_sensor_not_connected`
  },
  netcore_env_var_not_defined: {
    issueDescription: {
      Component: function netCoreEnvVarNotDefined({ missingEnvKeys }) {
        const missing = Array.isArray(missingEnvKeys) ? missingEnvKeys.join(', ') : missingEnvKeys;
        return (
          <span>
            The process environment for this .NET Core application is not correctly configured for Instana to be able to
            monitor it. The following environment variables must be set on the .NET Core process: <code>{missing}</code>
            . Refer to the documentation for the right values to be set.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net-core/#netcore_env_var_not_defined`
  },
  netcore_env_var_invalid_value: {
    issueDescription: {
      Component: function netCoreEnvVarInvalidValue({ invalidEnvKey, invalidEnvValue, competitor }) {
        if (competitor) {
          return (
            <span>
              It seems that another tool is monitoring this .NET Core process, likely {competitor}. The Instana host
              agent has detected this based on the value of the <code>{invalidEnvKey}</code> environment variable. For
              Instana to be able to trace this .NET Core process, you need to disable the other monitoring tool.
            </span>
          );
        }

        return (
          <span>
            The process environment for this .NET Core application is not correctly configured for Instana to be able to
            monitor it. The environment variable <code>{invalidEnvKey}</code> has the wrong value{' '}
            <code>{invalidEnvValue}</code>. Refer to the documentation for guidance on which value to set to the{' '}
            <code>{invalidEnvKey}</code> environment variable.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net-core/#netcore_env_var_invalid_value`
  }
};
