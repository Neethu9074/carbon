/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Message } from '@instana/components';
import { useTheme } from '@instana/hooks';

import { t } from 'in-i18n';

export default function EditConfigNotice() {
  const theme = useTheme();

  return (
    <Message withIcon iconType="lib_help_error_info_outline" iconColor={theme.ids.color.option.neutral[600]}>
      {t('in-custom-dashboards:widgets.apdex.createApdexForm.editConfigNotice')}
    </Message>
  );
}
