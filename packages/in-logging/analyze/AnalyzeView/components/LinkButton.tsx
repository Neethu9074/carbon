/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { IconButton } from '@instana/components';

import { buildJsonSerializer, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { fixateTimeConfig, getTimeConfig, setTimeConfig } from 'in-stores/time/config';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { logsPath } from 'in-logging/navigation/paths';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export interface LinkButtonProps {
  initialLogLines: number;
  itemId: string;
  time: number;
  groupKey?: string;
  className?: string;
}

export function LinkButton({ itemId, time, groupKey, className }: LinkButtonProps) {
  const link = useAbsoluteUrlToItem(itemId, time, groupKey);
  return (
    <Tooltip content={t('in-logging:tooltipCopyLinkToClipboard')}>
      <CopyToClipboard getText={() => link.toString()}>
        {(copyToClipboardRef: React.ForwardedRef<HTMLButtonElement>) => (
          <IconButton
            data-testid="link-button"
            color="var(--ids-color-option-neutral-900)"
            className={className}
            ref={copyToClipboardRef}
            iconSize={'xs'}
            type="lib_actions_interface_link"
            onClick={e => {
              e.stopPropagation();
            }}
          />
        )}
      </CopyToClipboard>
    </Tooltip>
  );
}

function toAbsoluteUrl(partialUrl: string) {
  return new URL(partialUrl, window.location.origin);
}

function useAbsoluteUrlToItem(itemId: string, time: number, groupKey?: string): URL {
  const { location, createHref } = useNavigation();

  const timeConfig = getTimeConfig(location);
  setTimeConfig(
    location,
    fixateTimeConfig({
      windowSize: timeConfig.windowSize,
      focusedMoment: timeConfig.focusedMoment,
      autoRefresh: timeConfig.autoRefresh,
      to: time
    })
  );
  setOrDeleteMatrixKey(location, logsPath, 'selectedId', buildJsonSerializer()(itemId));

  if (groupKey) {
    setOrDeleteMatrixKey(location, logsPath, 'selectedGroup', buildJsonSerializer()(groupKey));
  }

  return toAbsoluteUrl(createHref(location));
}
