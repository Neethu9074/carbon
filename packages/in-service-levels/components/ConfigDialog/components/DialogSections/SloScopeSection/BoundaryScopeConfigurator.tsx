/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { ApplicationBoundaryScope } from '@instana/types';
import { t } from '@instana/i18n-react';

import OptionBox from 'in-applications/components/OptionBox';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from './BoundaryScopeConfigurator.mless';

interface BoundaryScopeConfiguratorProps {
  value: ApplicationBoundaryScope;
  onChange?: (value: ApplicationBoundaryScope) => void;
}

export default function BoundaryScopeConfigurator({ value, onChange }: BoundaryScopeConfiguratorProps) {
  return (
    <Row>
      <Col md={6} xs={5}>
        <OptionBox
          className={classNames({
            [locals.optionBox]: true,
            [locals.optionBoxUnchecked]: value !== 'INBOUND'
          })}
          icon="lib_application_boundary_inbound_calls"
          title={t('in-custom-dashboards:widgets.slo.boundaryScopeConfigurator.inbound.title')}
          description={t('in-custom-dashboards:widgets.slo.boundaryScopeConfigurator.inbound.description')}
          onChange={() => onChange?.('INBOUND')}
          checked={value === 'INBOUND'}
          asRadioButton
        />
      </Col>
      <Col md={6} xs={5}>
        <OptionBox
          className={classNames({
            [locals.optionBox]: true,
            [locals.optionBoxUnchecked]: value !== 'ALL'
          })}
          icon="lib_application_boundary_all_calls"
          title={t('in-custom-dashboards:widgets.slo.boundaryScopeConfigurator.all.title')}
          description={t('in-custom-dashboards:widgets.slo.boundaryScopeConfigurator.all.description')}
          onChange={() => onChange?.('ALL')}
          checked={value === 'ALL'}
          asRadioButton
        />
      </Col>
    </Row>
  );
}
