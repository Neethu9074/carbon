/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import {
  StaticOrAdaptiveType,
  staticOrAdaptiveThresholds as types
} from 'in-alerting/smart-alerts/applications/advanced/StaticOrAdaptiveThresholdSwitch/config';
import StaticOrAdaptiveOption from 'in-alerting/smart-alerts/applications/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveOption';
import { STATIC_THRESHOLD, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { Col, Row } from 'in-components/layout/Grid';
import { noop } from 'in-services/util/function';
import { ThresholdType } from 'in-types';

import locals from 'in-alerting/smart-alerts/applications/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch.mless';

interface Props {
  form: MapForm;
  setForm: (updatedForm: MapForm) => void;
  onThresholdTypeChange: (
    typeWithOptionalSeasonality: string,
    form: MapForm,
    updateForm: (form: MapForm) => void,
    trackThresholdTypeChanged: (trackingObject: any) => void
  ) => void;
}

export default function StaticOrAdaptiveSwitch({ form, setForm, onThresholdTypeChange }: Props) {
  const thresholdType = ((form.get('threshold') as MapForm)?.get('type') as Field<ThresholdType>)?.value;
  const currentType = thresholdType === ADAPTIVE_BASELINE ? types.adaptive : types.static;

  return (
    <Row className={locals.verticalAlignedCells}>
      <Col lg={6}>
        <StaticOrAdaptiveOption currentType={currentType} onChange={updateThresholdType} baselineType={types.static} />
      </Col>
      <Col lg={6} className={locals.staticOrAdaptiveOption}>
        <StaticOrAdaptiveOption
          currentType={currentType}
          onChange={updateThresholdType}
          baselineType={types.adaptive}
        />
      </Col>
    </Row>
  );

  function updateThresholdType(baselineType: StaticOrAdaptiveType) {
    if (baselineType === types.static) {
      onThresholdTypeChange(STATIC_THRESHOLD, form, setForm, noop);
    }
    if (baselineType === types.adaptive) {
      onThresholdTypeChange(ADAPTIVE_BASELINE, form, setForm, noop);
    }
  }
}
