/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { ApplicationBoundaryScope } from '@instana/types';

import OptionBox from 'in-applications/components/OptionBox';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { t } from 'in-i18n';

import locals from './BoundaryScopeConfigurator.mless';

interface BoundaryScopeConfiguratorProps {
  disabled?: boolean;
  onChange?: (value: ApplicationBoundaryScope) => void;
  value: ApplicationBoundaryScope;
}

export default function BoundaryScopeConfigurator({
  disabled = false,
  value,
  onChange
}: BoundaryScopeConfiguratorProps) {
  return (
    <Row>
      <Col md={6} xs={5}>
        <OptionBox
          asRadioButton
          checked={value === 'INBOUND'}
          className={classNames({
            [locals.optionBox]: true,
            [locals.optionBoxUnchecked]: value !== 'INBOUND'
          })}
          description={t('in-custom-dashboards:widgets.slo.boundaryScopeConfigurator.inbound.description')}
          disabled={disabled}
          icon="lib_application_boundary_inbound_calls"
          onChange={() => onChange?.('INBOUND')}
          title={t('in-custom-dashboards:widgets.slo.boundaryScopeConfigurator.inbound.title')}
        />
      </Col>
      <Col md={6} xs={5}>
        <OptionBox
          asRadioButton
          className={classNames({
            [locals.optionBox]: true,
            [locals.optionBoxUnchecked]: value !== 'ALL'
          })}
          checked={value === 'ALL'}
          description={t('in-custom-dashboards:widgets.slo.boundaryScopeConfigurator.all.description')}
          disabled={disabled}
          icon="lib_application_boundary_all_calls"
          onChange={() => onChange?.('ALL')}
          title={t('in-custom-dashboards:widgets.slo.boundaryScopeConfigurator.all.title')}
        />
      </Col>
    </Row>
  );
}
