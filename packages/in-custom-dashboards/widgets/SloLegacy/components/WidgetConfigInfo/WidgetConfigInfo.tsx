/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { ReactNode } from 'react';

import { SvgIcon } from '@instana/components';

import WidgetConfigInfoTooltip from 'in-custom-dashboards/widgets/SloLegacy/components/WidgetConfigInfo/WidgetConfigInfoTooltip';
import Tooltip from 'in-components/Tooltip';

import locals from './WidgetConfigInfo.mless';

interface WidgetConfigInfoProps {
  children?: ReactNode;
}

export default function WidgetConfigInfo({ children }: WidgetConfigInfoProps) {
  return (
    <Tooltip
      themeStyle="light"
      content={<WidgetConfigInfoTooltip>{children}</WidgetConfigInfoTooltip>}
      align="bottomMiddle"
      delay={250}
      legacy
    >
      <SvgIcon className={locals.widgetInfo} type="lib_help_error_info_outline" size="s" />
    </Tooltip>
  );
}
