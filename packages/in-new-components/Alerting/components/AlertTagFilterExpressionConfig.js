/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import AlertFilterConfigurator, {
  handleChangeTagFilterExpressionChange
} from 'in-new-components/Alerting/components/AlertFilterConfigurator';
import { maxChartViewTimeConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import ScopeConfig from 'in-new-components/Alerting/components/scopeConfig/ScopeConfig';
import { smartAlertsAdvancedEntitySelectionEnabled } from 'in-services/featureFlags';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import LightCard from 'in-new-components/Card/LightCard';
import Button from 'in-new-components/Button';

import locals from './AlertTagFilterExpressionConfig.mless';

export const inPackages = Object.freeze({
  IN_APPLICATIONS: 'in-applications',
  IN_WEBSITES: 'in-websites'
});

export default function AlertTagFilterExpressionConfig({
  label,
  form,
  updateForm,
  QueryBuilderComponent,
  headerTransparent,
  removeBorderBottom,
  inPackage,
  ...remaingProps
}) {
  let element;

  if (inPackage === inPackages.IN_APPLICATIONS && smartAlertsAdvancedEntitySelectionEnabled) {
    element = (
      <ScopeConfig
        {...remaingProps}
        form={form}
        updateForm={updateForm}
        QueryBuilderComponent={QueryBuilderComponent}
        timeConfig={maxChartViewTimeConfig}
      />
    );
  } else {
    element = (
      <LightCard
        title={
          <IconLabel
            text={label}
            type={inPackage === inPackages.IN_APPLICATIONS ? 'lib_application' : 'lib_website'}
            noBottomMargin
          />
        }
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

  return element;
}

AlertTagFilterExpressionConfig.propTypes = {
  QueryBuilderComponent: PropTypes.func.isRequired,
  /**
   * Website or Application label
   */
  label: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  headerTransparent: PropTypes.bool,
  removeBorderBottom: PropTypes.bool,
  /**
   * Defines in which area we use this component
   */
  inPackage: PropTypes.oneOf(Object.values(inPackages)).isRequired
};

export function ClearTagFilterExpressionButton({ form, updateForm, customFormUpdater }) {
  return (
    <Button
      kind="subtle"
      icon="lib_openclose_cancel"
      size="compact"
      onClick={() =>
        typeof customFormUpdater === 'function'
          ? customFormUpdater()
          : handleChangeTagFilterExpressionChange([], form, updateForm)
      }
    >
      {t('in-new-components:alerting.components.clearTagFilterExpressionButton')}
    </Button>
  );
}
