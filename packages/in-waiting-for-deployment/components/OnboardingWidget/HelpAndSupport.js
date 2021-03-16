/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ExpandableCard from 'in-new-components/ExpandableCard';
import Button from 'in-new-components/Button';
import { light } from 'in-themes/themes';
import { t } from 'in-i18n';

export default function HelpAndSupport({ trackingService }) {
  return (
    <LocallyChangedTheme theme={light}>
      <ExpandableCard title={t('in-waiting-for-deployment:helpSupport')} framed={false} openByDefault={false}>
        <Button
          kind="secondary"
          icon="lib_help_error_help_outline"
          target="_blank"
          href="https://instana.com/docs/"
          onClick={() => trackingService.helpAndSupportClicked()}
        >
          {t('in-waiting-for-deployment:helpDocumentation')}
        </Button>
      </ExpandableCard>
    </LocallyChangedTheme>
  );
}
