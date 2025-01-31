/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonButton, Typography, Stack, CarbonTile } from '@instana/components';

import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { HeaderItemTileProps } from 'in-plg/components/HeaderItemTile/types';

import locals from 'in-plg/components/HeaderItemTile/HeaderItemTile.mless';

export function HeaderItemTile({
  title,
  description,
  buttonType,
  buttonName,
  href,
  hasPermission,
  onButtonClick
}: HeaderItemTileProps) {
  return (
    <CarbonTile className={locals.headerItemTile}>
      <Stack direction="vertical" gap="xxsmall">
        <Typography variant="heading-01">{title}</Typography>
        <Typography variant="body-01">{description}</Typography>
      </Stack>
      <CarbonButton
        data-test-id="tile-button"
        kind={buttonType}
        disabled={!hasPermission}
        renderIcon={() => <IconForButton icon="lib_arrow_right" iconSize="xs" />}
        className={classNames({ [locals.tileButton]: true, [locals.tileGhostButton]: buttonType === 'ghost' })}
        href={href}
        iconDescription={buttonName}
        onClick={() => onButtonClick?.()}
        size="sm"
      >
        {buttonName}
      </CarbonButton>
    </CarbonTile>
  );
}
