import PropTypes from 'prop-types';
import React from 'react';

import AlertFilterConfigurator, {
  handleChangeTagFilterExpressionChange
} from 'in-new-components/Alerting/components/AlertFilterConfigurator';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import evaluateClassNames from 'in-services/util/classnames';
import LightCard from 'in-new-components/Card/LightCard';
import Button from 'in-new-components/Button';

import locals from './AlertTagFilterExpressionConfig.mless';

export default function AlertTagFilterExpressionConfig({
  applicationLabel,
  form,
  updateForm,
  QueryBuilderComponent,
  headerTransparent,
  removeBorderBottom
}) {
  return (
    <LightCard
      title={<IconLabel text={applicationLabel} type="lib_application" noBottomMargin />}
      headerClassName={evaluateClassNames({
        [locals.header]: true,
        [locals.headerTransparent]: headerTransparent
      })}
      className={removeBorderBottom && locals.removeContainerBorderBottom}
      header={
        form.get('tagFilterExpression').value.length > 0 && (
          <Button
            className={locals.clearButton}
            kind="subtle"
            icon="lib_openclose_cancel"
            size="compact"
            onClick={() => handleChangeTagFilterExpressionChange([], form, updateForm)}
          >
            Clear
          </Button>
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
  applicationLabel: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  headerTransparent: PropTypes.bool,
  updateForm: PropTypes.func.isRequired,
  removeBorderBottom: PropTypes.bool
};
