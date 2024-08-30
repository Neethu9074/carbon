/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import TagFilterExpressionConfig from 'in-custom-dashboards/widgets/SloLegacy/sli/TagFilterExpressionConfig';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { DataSourceType, getIconByType } from 'in-analyze/AnalyzeView/dataSources';
import { sliFieldNames } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliForm';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/SloLegacy/sli/GoodBadEventsForm.mless';

interface GoodBadEventsConfiguratorProps {
  entityType: MonitoringSource;
  label: string;
  form: MapForm<any>;
  updateForm: (updatedForm: MapForm<any>) => void;
  QueryBuilderComponent: QueryBuilderComponent;
}

export default function GoodBadEventsConfigurator({
  entityType,
  label,
  QueryBuilderComponent,
  form,
  updateForm
}: GoodBadEventsConfiguratorProps) {
  const goodEventFilterExpressionField = form.get(sliFieldNames.goodEventFilterExpression) as Field<FormModelElement[]>;
  const badEventFilterExpressionField = form.get(sliFieldNames.badEventFilterExpression) as Field<FormModelElement[]>;

  return (
    <>
      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.goodBadEventsForm.goodEvents')}</Header>
        <div className={locals.withBottomGap}>
          <TagFilterExpressionConfig
            value={goodEventFilterExpressionField.value}
            onChange={value =>
              updateForm(
                form.updateIn([sliFieldNames.goodEventFilterExpression], f =>
                  (f as Field<FormModelElement[]>).setValue(value).setTouched(true)
                )
              )
            }
            QueryBuilderComponent={QueryBuilderComponent}
            label={label}
            icon={getIconType(entityType, form)}
          />
          {goodEventFilterExpressionField && (
            <TouchedMessages field={goodEventFilterExpressionField} className={locals.validationText} />
          )}
        </div>
      </Stack>

      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.goodBadEventsForm.badEvents')}</Header>
        <div className={locals.withBottomGap}>
          <TagFilterExpressionConfig
            value={badEventFilterExpressionField.value}
            onChange={value =>
              updateForm(
                form.updateIn([sliFieldNames.badEventFilterExpression], f =>
                  (f as Field<FormModelElement[]>).setValue(value).setTouched(true)
                )
              )
            }
            QueryBuilderComponent={QueryBuilderComponent}
            label={label}
            icon={getIconType(entityType, form)}
          />
          {badEventFilterExpressionField && (
            <TouchedMessages field={badEventFilterExpressionField} className={locals.validationText} />
          )}
        </div>
      </Stack>
    </>
  );
}

function getIconType(entityType: MonitoringSource, form: MapForm<any>): string {
  if (entityType === 'application') {
    return 'lib_application';
  }

  const beaconType = (form.get('beaconType') as Field<DataSourceType<'website'>>)?.value;
  return getIconByType(beaconType, 'website'); // TODO: check if we want to import this from in-analyze or potentially share it elsewhere
}
