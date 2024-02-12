/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { Message } from '@instana/components';

import { t } from 'in-i18n';

export default function EditConfigNotice() {
  return (
    <Message withIcon iconType="lib_help_error_info_outline" iconColor={themes.default.ids.color.option.neutral[600]}>
      {t('in-custom-dashboards:widgets.apdex.createApdexForm.editConfigNotice')}
    </Message>
  );
}
