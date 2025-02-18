/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc. 2025
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
import { PER_AP_ENDPOINT } from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { STATIC_THRESHOLD, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { Col, Row } from 'in-components/layout/Grid';
import { noop } from 'in-services/util/function';
import { AlertEvaluationType } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch.mless';

interface Props {
  form: MapForm<any>;
  setForm: (updatedForm: MapForm<any>) => void;
  onThresholdTypeChange: (
    typeWithOptionalSeasonality: string,
    form: MapForm<any>,
    updateForm: (form: MapForm<any>) => void,
    trackThresholdTypeChanged?: (trackingObject: any) => void,
    editMode?: boolean
  ) => void;
  editMode?: boolean;
  isTearSheet?: boolean;
  isDisabled?: boolean;
  bluePrint?: string;
}

export default function StaticOrAdaptiveSwitch({
  form,
  setForm,
  onThresholdTypeChange,
  isTearSheet,
  isDisabled,
  bluePrint,
  editMode = false
}: Props) {
  const thresholdType = form.get('threshold')?.get('warningThreshold')?.get('type')?.value;
  const evaluationType = (form.get('evaluationType') as Field<AlertEvaluationType>)?.value;
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
            isDisabled={evaluationType === PER_AP_ENDPOINT || isDisabled}
            badgeTitle={t(
              'in-alerting:smartAlerts.applications.tearSheet.staticOrAdaptive.config.adaptive.notSupported'
            )}
            tooltipContent={evaluationType && getTooltipMsg(evaluationType, isDisabled, bluePrint)}
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

  function getTooltipMsg(evaluationType: AlertEvaluationType, isDisabled?: boolean, bluePrint?: string) {
    if (isDisabled) {
      return t(
        'in-alerting:smartAlerts.applications.tearSheet.staticOrAdaptive.config.adaptive.adaptiveNotSupportedForBluePrint',
        { bluePrint }
      );
    } else if (evaluationType === PER_AP_ENDPOINT) {
      return t(
        'in-alerting:smartAlerts.applications.tearSheet.staticOrAdaptive.config.adaptive.adaptiveNotSupportedForEndPoint'
      );
    }
    return;
  }

  function updateThresholdType(baselineType: StaticOrAdaptiveType) {
    const thresholdType = baselineType === types.static ? STATIC_THRESHOLD : ADAPTIVE_BASELINE;
    onThresholdTypeChange(thresholdType, form, setForm, noop, editMode);
  }
}
