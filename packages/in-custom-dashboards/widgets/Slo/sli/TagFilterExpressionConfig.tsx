/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import FilterConfigurator from 'in-custom-dashboards/widgets/Slo/sli/FilterConfigurator';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { DataSourceType, getIconByType } from 'in-analyze/AnalyzeView/dataSources';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import IconLabel from 'in-alerting/components/IconLabel';
import { t } from 'in-i18n';

import locals from './TagFilterExpressionConfig.mless';

interface TagFilterExpressionConfigProps {
  entityType: MonitoringSource;
  label?: string;
  form: MapForm;
  updateForm: (updatedForm: MapForm) => void;
  formFieldName: string;
  QueryBuilderComponent: QueryBuilderComponent;
}

export default function TagFilterExpressionConfig({
  entityType,
  label,
  form,
  updateForm,
  formFieldName,
  QueryBuilderComponent
}: TagFilterExpressionConfigProps) {
  return (
    <LightCard
      title={<IconLabel text={label} type={getIconType(entityType, form)} noBottomMargin />}
      headerClassName={locals.header}
      header={
        (form.get(formFieldName) as Field<FormModelElement[]>)?.value.length > 0 && (
          <Button
            className={locals.clearButton}
            kind="subtle"
            icon="lib_openclose_cancel"
            size="compact"
            onClick={() =>
              updateForm(
                form.updateIn([formFieldName], f => (f as Field<FormModelElement[]>).setValue([]).setTouched(true))
              )
            }
          >
            {t('in-custom-dashboards:widgets.slo.tagFilterExpressConfig.clear')}
          </Button>
        )
      }
      darkFrame
    >
      <FilterConfigurator
        QueryBuilderComponent={QueryBuilderComponent}
        form={form}
        updateForm={updateForm}
        formFieldName={formFieldName}
      />
    </LightCard>
  );
}

TagFilterExpressionConfig.propTypes = {
  QueryBuilderComponent: PropTypes.func.isRequired,
  entityType: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  formFieldName: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired
};

function getIconType(entityType: MonitoringSource, form: MapForm) {
  if (entityType === 'application') {
    return 'lib_application';
  }

  const beaconType = (form.get('beaconType') as Field<DataSourceType<'website'>>)?.value;
  return getIconByType(beaconType, 'website'); // TODO: check if we want to import this from in-analyze or potentially share it elsewhere
}
