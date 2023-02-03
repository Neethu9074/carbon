/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { Stack, Button, SvgIcon } from '@instana/components';

import { putAllDataSourceFieldsForOneRule } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { ConditionItem } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/ConditionItem';
import { isDeprecatedAppDataEntityType } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { Row, Col } from 'in-components/layout/Grid';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/MultiConditions.mless';

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
  onChange: onChangeRoot,
  disabled,
  customMetricsForPlugin,
  entityType,
  builtInDataSourceSelected,
  customDataSourceSelected
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
                          putAllDataSourceFieldsForOneRule(entityType, {
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
          />
        );

        const onDeleteCondition = () =>
          onChangeRoot(form => form.updateIn(['rules'], listRule => listRule.remove(idx).setTouched(true)));

        if (!canHaveMultipleConditions) return <React.Fragment key={idx}>{conditionForm}</React.Fragment>;

        const buttonDisabled = disabled || rulesForm.size === 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <Row className={locals.andPill}>
                <Col lg={12}>
                  <Pill color={theme.lib.colors.primary1}>AND</Pill>
                </Col>
              </Row>
            )}

            <div className={locals.ruleBoxWithBorder}>
              <Stack direction="horizontal" gap="xsmall" align="center">
                <div className={locals.conditionWrapper}>{conditionForm}</div>
                <Tooltip content={rulesForm.size === 1 && 'There needs to be at least one condition.'} delay={500}>
                  <SvgIcon
                    aria-label="delete"
                    className={classNames({
                      [locals.disabledDelete]: buttonDisabled
                    })}
                    color={buttonDisabled ? '#86cff3' : theme.lib.colors.lightBlue800}
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
