/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { Stack, SvgIcon, Pill, RadioButton, IconButton, Button } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { putMetricDataSourceFieldsForOneRule } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { ConditionItem } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/ConditionItem';
import { isDeprecatedAppDataEntityType } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/util';
import { Row, Col } from 'in-components/layout/Grid';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/MultiConditions.mless';

const maxConditions = 5;

function getOnChangeUpdateRuleByIdx(onChangeRoot, idx) {
  return (ruleFieldName, value, updateFn) => {
    if (updateFn) {
      onChangeRoot(form =>
        form
          .updateIn(['rules', idx, ruleFieldName], ruleItemField => ruleItemField.setValue(value).setTouched(true))
          .updateIn(['rules', idx], updateFn)
      );
    } else {
      onChangeRoot(form =>
        form.updateIn(['rules', idx, ruleFieldName], ruleItemField => ruleItemField.setValue(value).setTouched(true))
      );
    }
  };
}

export function MultiConditions({
  rulesForm,
  ruleLogicalOperator,
  onChange: onChangeRoot,
  disabled,
  customMetricsForPlugin,
  entityType,
  builtInDataSourceSelected,
  customDataSourceSelected,
  form
}) {
  if (!rulesForm || !entityType) return null;

  const deprecatedAppDataEntityType = isDeprecatedAppDataEntityType(entityType);

  const canHaveMultipleConditions =
    (builtInDataSourceSelected || customDataSourceSelected) && !deprecatedAppDataEntityType;

  return (
    <>
      {canHaveMultipleConditions && (
        <Row withoutTopMargin withBottomMargin>
          <Col lg={12}>
            <Stack direction="horizontal" distribution="end">
              <Button
                disabled={rulesForm.size >= maxConditions}
                kind="action"
                icon="lib_openclose_add_circle_outline"
                onClick={() => {
                  onChangeRoot(form =>
                    form.updateIn(['rules'], field =>
                      field
                        .push(
                          putMetricDataSourceFieldsForOneRule(entityType, {
                            window: rulesForm.get(0)?.get('window')?.value
                          })
                        )
                        .setTouched(true)
                    )
                  );
                }}
              >
                {t('in-settings:tabs.team.events.addCondition')}
              </Button>
            </Stack>
          </Col>
        </Row>
      )}

      {rulesForm.map((ruleForm, idx) => {
        const conditionForm = (
          <ConditionItem
            builtInDataSourceSelected={builtInDataSourceSelected}
            customDataSourceSelected={customDataSourceSelected}
            entityType={entityType}
            form={ruleForm}
            onChange={getOnChangeUpdateRuleByIdx(onChangeRoot, idx)}
            disabled={disabled}
            customMetricsForPlugin={customMetricsForPlugin}
            compactLayout={canHaveMultipleConditions}
            hideTimeWindow={canHaveMultipleConditions}
            metricForm={form}
          />
        );

        const onDeleteCondition = () =>
          onChangeRoot(form => form.updateIn(['rules'], listRule => listRule.remove(idx).setTouched(true)));

        if (!canHaveMultipleConditions) return <React.Fragment key={idx}>{conditionForm}</React.Fragment>;

        const buttonDisabled = disabled || rulesForm.size === 1;
        return (
          <React.Fragment key={idx}>
            {idx === 1 && (
              <Row className={locals.logicalOperator}>
                <Col lg={2}>
                  <Stack direction="horizontal" align="start">
                    <RadioButton
                      checked={ruleLogicalOperator === 'AND'}
                      disabled={buttonDisabled}
                      label={t('in-settings:tabs.team.events.logicalOperator', { context: 'AND' })}
                      onChange={() => onChangeRoot('ruleLogicalOperator', 'AND')}
                      size="large"
                    />
                    <RadioButton
                      checked={ruleLogicalOperator === 'OR'}
                      disabled={buttonDisabled}
                      label={t('in-settings:tabs.team.events.logicalOperator', { context: 'OR' })}
                      onChange={() => onChangeRoot('ruleLogicalOperator', 'OR')}
                      size="large"
                    />
                    <Tooltip align="rightMiddle" content={t('in-settings:tabs.team.events.logicalOperatorInfo')}>
                      <SvgIcon
                        type="lib_help_error_info_outline"
                        color={themes.default.ids.color.option.neutral['600']}
                      />
                    </Tooltip>
                  </Stack>
                </Col>
              </Row>
            )}
            {idx > 1 && (
              <Row className={locals.logicalOperator}>
                <Col lg={1}>
                  <Pill type="teal">
                    {t('in-settings:tabs.team.events.logicalOperator', { context: ruleLogicalOperator })}
                  </Pill>
                </Col>
              </Row>
            )}

            <div className={locals.ruleBoxWithBorder}>
              <Stack direction="horizontal" gap="xsmall" align="start">
                <div className={locals.conditionWrapper}>{conditionForm}</div>
                <Tooltip content={rulesForm.size === 1 && 'There needs to be at least one condition.'} delay={500}>
                  <IconButton
                    kind="primary"
                    aria-label="delete"
                    className={classNames({
                      [locals.disabledDelete]: buttonDisabled,
                      [locals.deleteButton]: true,
                      [locals.deleteMargin]: true
                    })}
                    color={buttonDisabled ? '#86cff3' : themes.default.ids.color.option.blue['400']}
                    type="lib_actions_delete"
                    onClick={() => {
                      if (!buttonDisabled) onDeleteCondition();
                    }}
                  />
                </Tooltip>
              </Stack>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}
