/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { OperationalTag, Stack, Tag, Toggletip, ToggletipButton, ToggletipContent } from '@instana/carbon';
import type { CorrectionConfiguration } from '@instana/types';

import useCorrectionWindowsContext from 'in-service-levels/hooks/useCorrectionWindowsContext';
import { t } from 'in-i18n';

import locals from './CorrectionWindowPill.mless';

export default function CorrectionWindowPill() {
  const { configurations, selectedConfigurations } = useCorrectionWindowsContext();
  const activeConfigurations = configurations?.filter(c => c.active);

  if (!selectedConfigurations || !activeConfigurations || activeConfigurations.length === 0) return null;

  const names = (selectedConfigurations.length === 0 ? activeConfigurations : selectedConfigurations).map(
    ({ name }) => name!
  );
  const label = getLabel(selectedConfigurations);

  return (
    <Toggletip align="bottom">
      <ToggletipButton>
        <OperationalTag text={label} type="blue" />
      </ToggletipButton>
      <ToggletipContent>
        <Stack orientation="vertical" gap={1}>
          {names.map((name, index) => (
            <Tag className={locals['correction-window-tag']} key={`${index}:${name}`} type="blue">
              {name}
            </Tag>
          ))}
        </Stack>
      </ToggletipContent>
    </Toggletip>
  );
}

function getLabel(selectedConfigurations: CorrectionConfiguration[]) {
  if (selectedConfigurations.length === 0) {
    return t('in-service-levels:sloDashboard.components.correctionWindowPill.all');
  } else if (selectedConfigurations.length === 1) {
    const [configuration] = selectedConfigurations;
    return configuration.name!;
  } else {
    const count = selectedConfigurations.length;
    return t('in-service-levels:sloDashboard.components.correctionWindowPill.count', { count });
  }
}
