/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Stack, SvgIcon } from '@instana/components';

import { t } from 'in-i18n';

import locals from './PreviewFooter.mless';

export default function PreviewFooter() {
  return (
    <div className={locals.wrapper}>
      <Stack direction="horizontal" align="center">
        <SvgIcon type="lib_help_error_info_outline" />
        {t('in-custom-dashboards:widgets.apdex.widget.previewDataInfo')}
      </Stack>
    </div>
  );
}
