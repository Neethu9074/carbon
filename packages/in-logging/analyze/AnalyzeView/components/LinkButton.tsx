/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIconSizes } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { maxInitialLogLines } from 'in-logging/analyze/AnalyzeView/components/constants';
import { buildJsonSerializer, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { fixateTimeConfig, getTimeConfig, setTimeConfig } from 'in-stores/time/config';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import IconButton from 'in-components/IconButton/IconButton';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { logsPath } from 'in-logging/navigation/paths';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export interface LinkButtonProps {
  initialLogLines: number;
  itemId: string;
  time: number;
}

export function LinkButton({ itemId, time, initialLogLines }: LinkButtonProps) {
  const linkString = useObservable(getURLText(itemId, time, initialLogLines), []);
  return (
    <Tooltip content={t('in-logging:tooltipCopyLinkToClipboard')}>
      <CopyToClipboard getText={() => linkString?.toString() || ''}>
        {(copyToClipboardRef: React.ForwardedRef<HTMLButtonElement>) => (
          <IconButton ref={copyToClipboardRef} iconSize={SvgIconSizes.xs} type="lib_actions_interface_link" />
        )}
      </CopyToClipboard>
    </Tooltip>
  );
}

function toAbsoluteUrl(partialUrl: string) {
  return new URL(partialUrl, window.location.origin);
}

function getURLText(itemId: string, time: number, initialLogLines: number) {
  // Rare case: if log messages are produced with time offset after the link creation
  // the itemId might be not in the initialLogLines, thats why we load 20 more lines
  if (initialLogLines <= maxInitialLogLines - 20) {
    initialLogLines += 20;
  }
  return getModifiedUrlStream(location => {
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
    setOrDeleteMatrixKey(location, logsPath, 'initialLogLines', buildJsonSerializer()(initialLogLines));
  }).map(toAbsoluteUrl);
}
