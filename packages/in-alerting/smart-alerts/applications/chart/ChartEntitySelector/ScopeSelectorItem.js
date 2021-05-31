/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ScopeSelectorItem.mless';

const iconSize = 's';

export const ScopeSelectorEndpoint = ({ applicationName, serviceName, endpointName }) => (
  <HorizontalFlexWrapper className={locals.selectorItem}>
    <Tooltip content={applicationName}>
      <div className={locals.smallColumn}>
        <SvgIcon size={iconSize} type="lib_application_service" className={locals.entityIcon} />
        {applicationName}
      </div>
    </Tooltip>

    <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />

    <Tooltip content={serviceName}>
      <div className={locals.smallColumn}>
        <SvgIcon size={iconSize} type="lib_application_service" className={locals.entityIcon} />
        {serviceName}
      </div>
    </Tooltip>

    <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />

    <HorizontalFlexWrapper className={classNames(locals.fullColumn)}>
      <SvgIcon type="lib_application_endpoint" size={iconSize} />
      {endpointName}
    </HorizontalFlexWrapper>
  </HorizontalFlexWrapper>
);

export const ScopeSelectorServiceItem = ({ applicationName, serviceName }) => (
  <HorizontalFlexWrapper className={locals.selectorItem}>
    <Tooltip content={applicationName}>
      <div className={locals.normalColumn}>
        <SvgIcon size={iconSize} type="lib_application_service" className={locals.entityIcon} />
        {applicationName}
      </div>
    </Tooltip>

    <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />

    <HorizontalFlexWrapper className={classNames(locals.fullColumn)}>
      <SvgIcon type="lib_application_service" size={iconSize} />
      {serviceName}
    </HorizontalFlexWrapper>
  </HorizontalFlexWrapper>
);

export const ScopeSelectorAppItem = ({ applicationName }) => (
  <HorizontalFlexWrapper className={locals.selectorItem}>
    <HorizontalFlexWrapper className={classNames(locals.fullColumn)}>
      <SvgIcon type="lib_application" size={iconSize} />
      {applicationName}
    </HorizontalFlexWrapper>
  </HorizontalFlexWrapper>
);
