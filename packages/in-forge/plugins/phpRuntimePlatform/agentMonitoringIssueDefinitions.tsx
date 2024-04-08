/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  end_of_life_php_version: {
    issueDescription: {
      Component: function endOfLifePhpVersion({ url, version }: { url: string; version: string }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.phpRuntimePlatform.endOfLifePhpVersion" values={{ url, version }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.phpRuntimePlatform.supportedVersionsPage'),
    explanationLinkHref: `https://www.php.net/supported-versions.php`
  }
};
