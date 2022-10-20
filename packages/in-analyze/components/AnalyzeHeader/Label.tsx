/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { getIconByType, getLabelByType, productAreaIcons, productAreaLabels } from 'in-analyze/AnalyzeView/dataSources';
import { LabelProps } from 'in-analyze/components/AnalyzeHeader/types';

import locals from './AnalyzeHeader.mless';

function Label({ activeConfiguration }: LabelProps) {
  if (!activeConfiguration) {
    return null;
  }

  const { productArea, dataSource } = activeConfiguration;

  return (
    <div className={locals.label}>
      {productAreaLabels[productArea] !== getLabelByType(dataSource) && (
        <>
          <SvgIcon className={locals.productAreaIcon} type={productAreaIcons[productArea]} />
          <span className={locals.productAreaLabel}>{productAreaLabels[productArea]}</span>
          <span className={locals.separator}>/</span>
        </>
      )}
      <SvgIcon className={locals.dataSourceIcon} type={getIconByType(dataSource, productArea)} />
      <span className={locals.dataSourceLabel}>{getLabelByType(dataSource)}</span>
    </div>
  );
}

export default Label;
