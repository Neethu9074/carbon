// @flow

import { compose, withPropsOnChange } from 'recompose';
import { defaults, debounce } from 'lodash';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import withPropDependingState from 'in-hoc/withPropDependingState';
import connect from 'in-hoc/connectTo';

export default compose(
  withPropDependingState(
    [
      'columnDefinitions',
      'defaultOrderBy',
      'defaultOrderDirection',
      'defaultPageSize',
      'defaultQuery',
      'paginationResettingProps'
    ],
    ({ columnDefinitions, defaultOrderBy, defaultOrderDirection, defaultPageSize, defaultQuery }) => ({
      orderBy: defaultOrderBy || columnDefinitions[0].id,
      orderDirection: defaultOrderDirection || 'ASC',
      page: 1,
      pageSize: defaultPageSize || 10,
      query: defaultQuery || ''
    }),
    'onChange',
    (prevState, change) => defaults({}, change, prevState)
  ),
  withPropsOnChange(['onChange'], ({ onChange }) => ({ onChange: debounce(onChange, 500) })),
  connect(props => ({
    result: props.get(props)
  }))
)(ServerTablePresenter);
