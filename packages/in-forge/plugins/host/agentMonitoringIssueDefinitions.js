/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { t } from 'in-i18n';

export default {
  ebpf_not_supported: {
    issueDescription: {
      Component: function epbfNotSupported() {
        return (
          <span>
            {t(
              'in-forge:plugins.host.theOperatingSystemOfThisHostDoesNotSeemToOfferTheExtendedBerkeleyPacketFilterEBpfFunctionality'
            )}
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.host.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/host#ebpf_not_supported`
  }
};
