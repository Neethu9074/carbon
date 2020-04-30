import React from 'react';

export default {
  netcore_sensor_not_connected: {
    issueDescription: {
      Component: function netCoreSensorNotConnected() {
        return <span>The .NET Core Sensor failed to register itself with the agent</span>;
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/dot-net-core/#tracing`
  },
  netcore_env_var_not_defined: {
    issueDescription: {
      Component: function netCoreEnvVarNotDefined({ missingEnvKeys }) {
        const missing = Array.isArray(missingEnvKeys) ? missingEnvKeys.join(', ') : missingEnvKeys;
        return (
          <span>
            The following environment variable(s) necessary to enable the .NET Core Sensor are absent:{' '}
            <code>{missing}</code>
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/dot-net-core/#tracing`
  },
  netcore_env_var_invalid_value: {
    issueDescription: {
      Component: function netCoreEnvVarInvalidValue({ invalidEnvKey, invalidEnvValue }) {
        return (
          <span>
            The .NET Core Sensor is not correctly configured. Environment variable <code>{invalidEnvKey}</code> is set
            to value &quot;
            <code>{invalidEnvValue}</code>
            &quot;
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/dot-net-core/#tracing`
  }
};
