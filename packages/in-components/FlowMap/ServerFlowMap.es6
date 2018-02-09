import { compose, withPropsOnChange } from 'recompose';
import { defaults, debounce } from 'lodash';

import withPropDependingState from 'in-hoc/withPropDependingState';
import FlowMapImpl from 'in-components/FlowMap';
import connect from 'in-hoc/connectTo';

export default compose(
  withPropDependingState(
    ['defaultQuery'],
    ({ defaultQuery }) => ({
      query: defaultQuery || ''
    }),
    'onChange',
    (prevState, change) => defaults({}, change, prevState)
  ),
  withPropsOnChange(['onChange'], ({ onChange }) => ({ onChange: debounce(onChange, 500) })),
  connect(props => ({
    result: props.get(props)
  }))
)(FlowMapImpl);
