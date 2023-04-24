/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  eol_python_runtime: {
    issueDescription: {
      Component: function eolPythonRuntime({ url }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.pythonRuntimePlatform.eolPythonRuntime" values={{ url }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.pythonRuntimePlatform.longTermSupportDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/current?topic=package-python-supported-components-versions#long-term-support`
  }
};
