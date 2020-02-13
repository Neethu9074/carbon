import { compose, withProps, withState } from 'recompose';
import React from 'react';

import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { createForm, onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';

import locals from './MetricConfiguratorDialog.mless';

export default compose(
  withState('form', 'setForm', ({ metricConfiguration, withLabelConfiguration }) =>
    createForm(metricConfiguration, { withLabelConfiguration })
  ),
  withProps(({ form, setForm, onFinished }) => ({
    onChange: (path, fn) => setForm(form.updateIn(path, fn)),
    onChangeSource: newSource => onChangeSource(form, setForm, newSource),
    onSubmit: e => {
      e.preventDefault();

      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }

      onFinished(form.toJS());
      close();
    }
  }))
)(MetricConfiguratorDialog);

function MetricConfiguratorDialog({ form, onChange, onChangeSource, onSubmit, withLabelConfiguration }) {
  return (
    <Dialog title="Metric Configurator" onClose={close}>
      <form onSubmit={onSubmit}>
        <MetricConfigurator
          form={form}
          onChange={onChange}
          onChangeSource={onChangeSource}
          withLabelConfiguration={withLabelConfiguration}
        />

        <nav className={locals.controls}>
          <Button kind="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" kind="primaryv2" disabled={form.touched && !form.hierarchyValid}>
            Save
          </Button>
        </nav>
      </form>
    </Dialog>
  );
}
