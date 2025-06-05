/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Trans } from 'in-i18n';

export default {
  mapr_connect_error: {
    issueDescription: {
      Component: function mapRConnectionError({ error }: { error: string }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.maprNode.connectErrorIssueDescription"
              components={{
                code: <code />
              }}
              values={{ error: error }}
            />
          </span>
        );
      }
    }
  }
};
