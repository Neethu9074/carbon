import React from 'react';

export default {
  clr_env_var_not_defined: {
    issueDescription: {
      Component: function clrEnvVarNotDefined({ missingEnvKeys }) {
        const missing = Array.isArray(missingEnvKeys) ? missingEnvKeys.join(', ') : missingEnvKeys;
        return (
          <span>
            The process environment for this .NET Full Framework application is not correctly configured for Instana to
            be able to monitor it. The following environment variables must be set on the .NET Core process:{' '}
            <code>{missing}</code>. Refer to the documentation for the right values to be set.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net/#clr_env_var_not_defined`
  },
  clr_env_var_invalid_value: {
    issueDescription: {
      Component: function clrEnvVarInvalidValue({ invalidEnvKey, invalidEnvValue, competitor }) {
        if (competitor) {
          return (
            <span>
              It seems that another tool is monitoring this .NET Full Framework process, likely {competitor}. The
              Instana host agent has detected this based on the value of the <code>{invalidEnvKey}</code> environment
              variable. For Instana to be able to trace this .NET Core process, you need to disable the other monitoring
              tool.
            </span>
          );
        }

        return (
          <span>
            The process environment for this .NET Full Framework application is not correctly configured for Instana to
            be able to monitor it. The environment variable <code>{invalidEnvKey}</code> has the wrong value{' '}
            <code>{invalidEnvValue}</code>. Refer to the documentation for guidance on which value to set to the{' '}
            <code>{invalidEnvKey}</code> environment variable.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net/#clr_env_var_invalid_value`
  }
};
