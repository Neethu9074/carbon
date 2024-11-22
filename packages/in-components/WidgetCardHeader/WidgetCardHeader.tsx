/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface Props {
  renderApproximateDataTooltip?: boolean;
  approximateTooltipText?: string;
  renderWidgetNotSupportedIndicator?: boolean;
  liveModeNotSupportedTooltip?: string;
  extraInfoTooltip?: string;
}

export default function WidgetCardHeader({
  renderApproximateDataTooltip,
  approximateTooltipText,
  renderWidgetNotSupportedIndicator,
  liveModeNotSupportedTooltip = t('in-components:liveModeIndicator.widgetNotSupportedInLiveMode'),
  extraInfoTooltip
}: Props) {
  return (
    <>
      {renderApproximateDataTooltip && (
        <Tooltip content={approximateTooltipText ?? t('in-components:approximateDataIndicator.dataRetention')}>
          <SvgIcon type="lib_approximately_equal" color={themes.default.ids.color.option.neutral['300']} />
        </Tooltip>
      )}
      {renderWidgetNotSupportedIndicator && (
        <Tooltip content={liveModeNotSupportedTooltip}>
          <SvgIcon type="lib_help_error_info_outline" color={themes.default.cds.icon.primary} />
        </Tooltip>
      )}
      {extraInfoTooltip && (
        <Tooltip content={extraInfoTooltip}>
          <SvgIcon type="lib_help_error_info_outline" color={themes.default.cds.icon.primary} />
        </Tooltip>
      )}
    </>
  );
}
