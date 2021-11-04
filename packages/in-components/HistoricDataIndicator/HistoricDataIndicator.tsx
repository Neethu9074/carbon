/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './HistoricDataIndicator.mless';

interface Props {
  withMargin?: boolean;
}

export default function HistoricDataIndicator({ withMargin = false }: Props) {
  return (
    <Tooltip align="bottomMiddle" content={t('in-components:historicIndicator.dataRetention')}>
      <SvgIcon
        type="lib_approximately_equal"
        className={classNames(locals.indicator, {
          [locals.withMargin]: withMargin
        })}
      />
    </Tooltip>
  );
}
