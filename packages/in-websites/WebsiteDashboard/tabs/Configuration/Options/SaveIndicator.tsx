/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon, Stack } from '@instana/components';

import TemporaryPresenter from 'in-components/TemporaryPresenter';
import { t } from 'in-i18n';

import locals from './SaveIndicator.mless';

export interface Props {
  id?: string;
}

export default function SaveIndicator({ id }: Props) {
  if (id == null) {
    return null;
  }

  return (
    <TemporaryPresenter duration={5000} id={id}>
      <Stack direction="horizontal" space="xxsmall" align="center">
        <SvgIcon type="lib_check" size="s" className={locals.successIcon} />
        <span className={locals.sucessLabel}>{t('in-websites:websiteDashboard.tabs.configuration.saved')}</span>
      </Stack>
    </TemporaryPresenter>
  );
}
