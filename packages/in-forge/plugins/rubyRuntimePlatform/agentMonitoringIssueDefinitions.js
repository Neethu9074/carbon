/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  eol_ruby_runtime: {
    issueDescription: {
      Component: function eolRubyRuntime({ url }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.rubyRuntimePlatform.eolRubyRuntime" values={{ url }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.rubyRuntimePlatform.longTermSupportDocs'),
    explanationLinkHref: `https://ibm.biz/ruby-long-term-support`
  }
};
