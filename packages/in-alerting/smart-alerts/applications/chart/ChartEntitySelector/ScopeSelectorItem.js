/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { HighLightTerm } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/HighLightTerm';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ScopeSelectorItem.mless';

const iconSize = 'normal';

export const ScopeSelectorEndpoint = ({ applicationName, serviceName, endpointName, highlightText }) => (
  <HorizontalFlexWrapper className={locals.selectorItem}>
    <Tooltip align="topMiddle" delay={500} content={applicationName}>
      <div className={locals.smallColumn}>
        <SvgIcon size={iconSize} type="lib_application" className={locals.icon} />
        <HighLightTerm term={highlightText} text={applicationName} />
      </div>
    </Tooltip>

    <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />

    <Tooltip align="topMiddle" delay={500} content={serviceName}>
      <div className={locals.smallColumn}>
        <SvgIcon size={iconSize} type="lib_application_service" className={locals.icon} />
        <HighLightTerm term={highlightText} text={serviceName} />
      </div>
    </Tooltip>

    <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />

    <HorizontalFlexWrapper className={classNames(locals.fullColumn)}>
      <SvgIcon type="lib_application_endpoint" size={iconSize} className={locals.entityIcon} />
      <div>
        <HighLightTerm term={highlightText} text={endpointName} />
      </div>
    </HorizontalFlexWrapper>
  </HorizontalFlexWrapper>
);

export const ScopeSelectorServiceItem = ({ applicationName, serviceName, highlightText }) => (
  <HorizontalFlexWrapper className={locals.selectorItem}>
    <Tooltip align="topMiddle" delay={500} content={applicationName}>
      <div className={locals.normalColumn}>
        <SvgIcon size={iconSize} type="lib_application" className={locals.icon} />
        <HighLightTerm term={highlightText} text={applicationName} />
      </div>
    </Tooltip>

    <SvgIcon className={locals.separator} size={iconSize} type="lib_arrow_expand_right" />

    <HorizontalFlexWrapper className={classNames(locals.fullColumn)}>
      <SvgIcon type="lib_application_service" size={iconSize} className={locals.icon} />
      <div>
        <HighLightTerm term={highlightText} text={serviceName} />
      </div>
    </HorizontalFlexWrapper>
  </HorizontalFlexWrapper>
);

export const ScopeSelectorAppItem = ({ applicationName, highlightText }) => (
  <HorizontalFlexWrapper className={locals.selectorItem}>
    <HorizontalFlexWrapper className={classNames(locals.fullColumn)}>
      <SvgIcon type="lib_application" size={iconSize} className={locals.icon} />
      <div>
        <HighLightTerm term={highlightText} text={applicationName} />
      </div>
    </HorizontalFlexWrapper>
  </HorizontalFlexWrapper>
);
