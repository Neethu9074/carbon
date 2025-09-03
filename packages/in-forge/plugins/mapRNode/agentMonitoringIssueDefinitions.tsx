/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { t } from 'in-i18n';

export default {
  mapr_monitoring_error: {
    issueDescription: {
      Component: function mapRMonitoringError({ error }: { error: string }) {
        return <div>{error}</div>;
      }
    },
    explanationLinkLabel: t('in-forge:plugins.maprNode.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/monitoring_Mapr`
  }
};
