/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Message } from '@instana/components';
import { Stack } from '@instana/components';

import {
  StaticOrAdaptiveType,
  staticOrAdaptiveThresholds as types
} from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/config';
import StaticOrAdaptiveOption from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveOption';
import { STATIC_THRESHOLD, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { Col, Row } from 'in-components/layout/Grid';
import { noop } from 'in-services/util/function';
import { ThresholdType } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch.mless';

interface Props {
  form: MapForm<any>;
  setForm: (updatedForm: MapForm<any>) => void;
  onThresholdTypeChange: (
    typeWithOptionalSeasonality: string,
    form: MapForm<any>,
    updateForm: (form: MapForm<any>) => void,
    trackThresholdTypeChanged: (trackingObject: any) => void
  ) => void;
  isTearSheet?: boolean;
}

export default function StaticOrAdaptiveSwitch({ form, setForm, onThresholdTypeChange, isTearSheet }: Props) {
  const thresholdType = ((form.get('threshold') as MapForm<any>)?.get('type') as Field<ThresholdType>)?.value;
  const currentType = thresholdType === ADAPTIVE_BASELINE ? types.adaptive : types.static;
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;

  return (
    <Stack gap="xxsmall">
      <Row className={locals.verticalAlignedCells}>
        <Col lg={6}>
          <StaticOrAdaptiveOption
            currentType={currentType}
            onChange={updateThresholdType}
            baselineType={types.static}
            isTearSheet={isTearSheet}
          />
        </Col>
        <Col lg={6} className={locals.staticOrAdaptiveOption}>
          <StaticOrAdaptiveOption
            currentType={currentType}
            onChange={updateThresholdType}
            baselineType={types.adaptive}
            isTearSheet={isTearSheet}
          />
        </Col>
      </Row>
      <div className={classNames({ [locals.sidePadding]: !isTearSheet })}>
        {alertType === 'errors' && thresholdType === ADAPTIVE_BASELINE && (
          <Message
            className={classNames({
              [locals.topMargin]: isTearSheet,
              [locals.bottomMargin]: !isTearSheet
            })}
            withIcon
            fullInlineWidth
            description={t('in-alerting:smartAlerts.applications.advanced.staticOrAdaptiveSwitch.description')}
          />
        )}
      </div>
    </Stack>
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
