/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Information } from '@carbon/icons-react';
import React from 'react';

import { Link, CarbonStack as Stack, Typography, SvgIcon } from '@instana/components';

import { useSegmentTracker } from 'in-automation/tracker';
import { t } from 'in-i18n';

import locals from './ConsentForm.mless';

export default function ConsentForm(type: { type: string }) {
  const { clickEPWTLink } = useSegmentTracker();
  return (
    <Stack gap={4} className={locals.consentContent} orientation="horizontal">
      <Information />
      <Stack orientation="vertical">
        <Typography variant="body-regular"> {t('in-automation:consentForm.consentText')} </Typography>
        <Link
          target="_blank"
          onClick={e => {
            e.stopPropagation();
            clickEPWTLink({
              type
            });
          }}
          href="https://early-access.ibm.com/software/support/trial/cst/welcomepage.wss?siteId=2175&tabId=6106&w=1&_gl=1*a8q9zh*_ga*NDA2OTcyMzgyLjE3MTEzODYwOTA.*_ga_FYECCCS21D*MTc0MTM0MzI4NS41MS4xLjE3NDEzNDM5NjUuMC4wLjA"
        >
          {t('in-automation:consentForm.consentButton')}{' '}
          <SvgIcon size="xs" type="lib_views_external_link" color="var(--cds-link-primary)" />
        </Link>
      </Stack>
    </Stack>
  );
}
