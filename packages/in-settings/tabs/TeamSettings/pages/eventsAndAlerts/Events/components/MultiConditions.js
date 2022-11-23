/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Stack, Button } from '@instana/components';

import { putAllDataSourceFieldsForOneRule } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { ConditionItem } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/ConditionItem';
import { isAppDataEntityType } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import IconButton from 'in-components/IconButton/IconButton';
import { Row, Col } from 'in-components/layout/Grid';
import Pill from 'in-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/MultiConditions.mless';

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

  const appDataEntityType = isAppDataEntityType(entityType);

  const canHaveMultipleConditions = (builtInDataSourceSelected || customDataSourceSelected) && !appDataEntityType;

  return (
    <>
      {canHaveMultipleConditions && (
        <Row withBottomMargin>
          <Col lg={12}>
            <Stack direction={'horizontal'} distribution="spaceBetween">
              <div className={locals.header}>{t('in-settings:tabs.team.events.multiConditions')}</div>
              <Button
                kind="action"
                icon="lib_openclose_add_circle_outline"
                onClick={() => {
                  onChangeRoot(form =>
                    form.updateIn(['rules'], field =>
                      field.push(putAllDataSourceFieldsForOneRule(entityType, {})).setTouched(true)
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
        const onChange = (ruleFieldName, value, updateFn) => {
          if (updateFn) {
            onChangeRoot(form =>
              form
                .updateIn(['rules', idx, ruleFieldName], ruleItemField =>
                  ruleItemField.setValue(value).setTouched(true)
                )
                .updateIn(['rules', idx], updateFn)
            );
          } else {
            onChangeRoot(form =>
              form.updateIn(['rules', idx, ruleFieldName], ruleItemField =>
                ruleItemField.setValue(value).setTouched(true)
              )
            );
          }
        };

        const content = (
          <ConditionItem
            builtInDataSourceSelected={builtInDataSourceSelected}
            customDataSourceSelected={customDataSourceSelected}
            entityType={entityType}
            form={ruleForm}
            onChange={onChange}
            disabled={disabled}
            customMetricsForPlugin={customMetricsForPlugin}
            compactLayout
          />
        );

        const onDeleteCondition = () =>
          onChangeRoot(form => form.updateIn(['rules'], listRule => listRule.remove(idx).setTouched(true)));

        if (!canHaveMultipleConditions) return content;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <Row singleRowTopMargin withBottomMargin>
                <Col lg={12}>
                  <Pill color={theme.lib.colors.primary1}>AND</Pill>
                </Col>
              </Row>
            )}

            <div className={locals.ruleBoxWithBorder}>
              <Stack direction="horizontal" gap="xsmall" align="center">
                <div className={locals.conditionWrapper}>{content}</div>
                <IconButton
                  disabled={disabled}
                  type="lib_actions_delete"
                  kind="primaryv2"
                  onClick={e => {
                    stopPropagationAndPreventDefault(e);
                    onDeleteCondition();
                  }}
                />
              </Stack>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}
