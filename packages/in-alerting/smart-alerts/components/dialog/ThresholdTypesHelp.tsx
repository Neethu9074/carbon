/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { useEffect } from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

interface ThresholdTypesHelpProps {
  trackHover?: () => void;
}

export function ThresholdTypesHelp({ trackHover }: ThresholdTypesHelpProps) {
  return (
    <Tooltip align="auto" content={<ThresholdTypesHint trackHover={trackHover} />}>
      <SvgIcon type="lib_help_error_help_outline" size="s" color={themes.default.ids.color.option.neutral['700']} />
    </Tooltip>
  );
}

const staticThresholdTypesTooltip = t(
  'in-alerting:smartAlerts.components.smartAlertDialog.staticThresholdTypeOptionsTooltip'
);

const ThresholdTypesHint = ({ trackHover }: { trackHover?: () => void }) => {
  useEffect(() => {
    // wrap it to avoid returning anything which would be called on unmounting this component.
    //
    // main reason: this could be used by javascript components which do not catch
    // invalid function type (and might return anything != void
    if (trackHover) trackHover();
  });
  return <span>{staticThresholdTypesTooltip}</span>;
};
