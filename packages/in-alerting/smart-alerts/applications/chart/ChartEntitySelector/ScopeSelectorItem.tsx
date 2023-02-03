/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, Spacer } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ScopeSelectorItem.mless';

const iconSize = 'regular';

interface EndpointProps {
  applicationName: string;
  serviceName: string;
  endpointName: string;
}

export const ScopeSelectorEndpoint = ({ applicationName, serviceName, endpointName }: EndpointProps) => (
  <HorizontalFlexWrapper className={locals.selectorItem}>
    <Tooltip align="topMiddle" delay={500} content={applicationName}>
      <div className={locals.smallColumn}>
        <SvgIcon size={iconSize} type="lib_application" className={locals.icon} />
        <Spacer horizontal="xsmall" />
        <span className={locals.cutOffText}>{applicationName}</span>
      </div>
    </Tooltip>

    <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />

    <Tooltip align="topMiddle" delay={500} content={serviceName}>
      <div className={locals.smallColumn}>
        <SvgIcon size={iconSize} type="lib_application_service" className={locals.icon} />
        <Spacer horizontal="xsmall" />
        <span className={locals.cutOffText}>{serviceName}</span>
      </div>
    </Tooltip>

    <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />

    <HorizontalFlexWrapper className={classNames(locals.fullColumn)}>
      <SvgIcon type="lib_application_endpoint" size={iconSize} className={locals.entityIcon} />
      <Spacer horizontal="xsmall" />
      {endpointName}
    </HorizontalFlexWrapper>
  </HorizontalFlexWrapper>
);

interface ServiceItemProps {
  applicationName: string;
  serviceName: string;
}

export const ScopeSelectorServiceItem = ({ applicationName, serviceName }: ServiceItemProps) => (
  <HorizontalFlexWrapper className={locals.selectorItem}>
    <Tooltip align="topMiddle" delay={500} content={applicationName}>
      <div className={locals.normalColumn}>
        <SvgIcon size={iconSize} type="lib_application" className={locals.icon} />
        <Spacer horizontal="xsmall" />
        <span className={locals.cutOffText}>{applicationName}</span>
      </div>
    </Tooltip>

    <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />

    <HorizontalFlexWrapper className={classNames(locals.fullColumn)}>
      <SvgIcon type="lib_application_service" size={iconSize} className={locals.icon} />
      <Spacer horizontal="xsmall" />
      {serviceName}
    </HorizontalFlexWrapper>
  </HorizontalFlexWrapper>
);

interface AppItemProps {
  applicationName: string;
}

export const ScopeSelectorAppItem = ({ applicationName }: AppItemProps) => (
  <HorizontalFlexWrapper className={locals.selectorItem}>
    <HorizontalFlexWrapper className={classNames(locals.fullColumn)}>
      <SvgIcon type="lib_application" size={iconSize} className={locals.icon} />
      <Spacer horizontal="xsmall" />
      {applicationName}
    </HorizontalFlexWrapper>
  </HorizontalFlexWrapper>
);
