/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { DatePickerHeader } from 'in-plg/components/WelcomeHeader/WelcomeHeader';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/pages/components/CustomDashboardsHeader.mless';

export default function CustomDashboardsHeader() {
  return (
    <div className={locals.container}>
      <Stack direction="horizontal" distribution="spaceBetween" align="center">
        <div className={locals.tile}>
          <Stack direction="horizontal" align="center" gap="xsmall">
            <SvgIcon
              type="lib_custom_dashboard"
              size="regular"
              color={themes.default.ids.color.option.neutral['700']}
              aria-label={t('in-plg:welcomepage.component.dashboardWidget.label')}
            />
            <Typography variant="heading-04" component="h1" noMargin>
              {t('in-plg:welcomepage.component.dashboardWidget.label')}
            </Typography>
          </Stack>
        </div>
        <DatePickerHeader />
      </Stack>
    </div>
  );
}
