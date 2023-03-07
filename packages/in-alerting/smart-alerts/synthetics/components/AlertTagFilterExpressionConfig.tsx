/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { ClearTagFilterExpressionButton } from 'in-alerting/smart-alerts/components/dialog/ClearTagFilterExpressionButton';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import IconLabel from 'in-alerting/components/IconLabel';

import locals from 'in-alerting/smart-alerts/synthetics/components/AlertTagFilterExpressionConfig.mless';

export default function AlertTagFilterExpressionConfig({
  form,
  updateForm,
  QueryBuilderComponent,
  headerTransparent,
  removeBorderBottom
}) {
  return (
    <LightCard
      title={<IconLabel noBottomMargin />}
      headerClassName={classNames({
        [locals.header]: true,
        [locals.headerTransparent]: headerTransparent
      })}
      className={removeBorderBottom && locals.removeContainerBorderBottom}
      header={
        form.get('tagFilterExpression').value.length > 0 && (
          <ClearTagFilterExpressionButton form={form} updateForm={updateForm} />
        )
      }
      darkFrame
    >
      <AlertFilterConfigurator QueryBuilderComponent={QueryBuilderComponent} form={form} updateForm={updateForm} />
    </LightCard>
  );
}

AlertTagFilterExpressionConfig.propTypes = {
  QueryBuilderComponent: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  headerTransparent: PropTypes.bool,
  removeBorderBottom: PropTypes.bool
};
