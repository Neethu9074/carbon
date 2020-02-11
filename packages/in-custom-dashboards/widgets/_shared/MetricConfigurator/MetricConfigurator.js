import { compose, withState, withProps } from 'recompose';

import MetricConfiguratorPresenter from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfiguratorPresenter';
import {createForm, onChangeSource} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';

export default compose(
  withState('form', 'setForm', ({ metricConfiguration }) => createForm(metricConfiguration)),
  withProps(({form, setForm}) => ({
    onChange: (path, fn) => {
      if (path.length === 0) {
        setForm(fn(form));
      } else {
        setForm(form.updateIn(path, fn));
      }
    },
    onChangeSource: newSource => onChangeSource(form, setForm, newSource),
    onSubmit(e) {
      e.preventDefault();
      console.log('Go go go!', form.toJS());
    }
  }))
)(MetricConfiguratorPresenter);
