/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import BasicWrapper from 'in-new-components/Errors/BasicWrapper';
import SvgIcon from 'in-components/SvgIcon';

import locals from 'in-alerting/components/NoChannelSelected.mless';

export default function NoChannelSelected({
  height = 80, // default height of an empty row with icon
  text = t('in-alerting:components.noChannelSelectedText')
}) {
  return (
    <BasicWrapper
      text={text}
      height={height}
      className={locals.boldText}
      renderIcon={size => <SvgIcon className={locals.icon} type={'lib_help_error_warning_outline'} size={size} />}
    />
  );
}
