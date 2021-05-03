/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import FilterConfigurator from 'in-custom-dashboards/widgets/Slo/sli/FilterConfigurator';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import IconLabel from 'in-alerting/components/IconLabel';
import { t } from 'in-i18n';

import locals from './TagFilterExpressionConfig.mless';

export default function TagFilterExpressionConfig({
  applicationLabel,
  form,
  updateForm,
  formFieldName,
  QueryBuilderComponent
}) {
  return (
    <LightCard
      title={<IconLabel text={applicationLabel} type="lib_application" noBottomMargin />}
      headerClassName={locals.header}
      header={
        form.get(formFieldName)?.value.length > 0 && (
          <Button
            className={locals.clearButton}
            kind="subtle"
            icon="lib_openclose_cancel"
            size="compact"
            onClick={() => updateForm(form.updateIn([formFieldName], f => f.setValue([]).setTouched(true)))}
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
  applicationLabel: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  formFieldName: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired
};
