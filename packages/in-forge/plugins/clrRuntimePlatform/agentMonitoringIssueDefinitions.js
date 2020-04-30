import React from 'react';

export default {
  clr_env_var_not_defined: {
    issueDescription: {
      Component: function clrEnvVarNotDefined({ missingEnvKeys }) {
        const missing = Array.isArray(missingEnvKeys) ? missingEnvKeys.join(', ') : missingEnvKeys;
        return (
          <span>
            The following environment variable(s) necessary to enable the .NET Sensor are absent: <code>{missing}</code>
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/dot-net/#tracing`
  },
  clr_env_var_invalid_value: {
    issueDescription: {
      Component: function clrEnvVarInvalidValue({ invalidEnvKey, invalidEnvValue }) {
        return (
          <span>
            The .NET Sensor is not correctly configured. Environment variable <code>{invalidEnvKey}</code> is set to
            value &quot;
            <code>{invalidEnvValue}</code>
            &quot;
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/dot-net/#tracing`
  }
};
