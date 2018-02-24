// @flow

import { compose } from 'recompose';
import { defaults } from 'lodash';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import withPropDependingState from 'in-hoc/withPropDependingState';
import connect from 'in-hoc/connectTo';

export default compose(
  withPropDependingState({
    resettingProps: [
      'columnDefinitions',
      'defaultOrderBy',
      'defaultOrderDirection',
      'defaultPageSize',
      'defaultQuery',
      'get',
      'paginationResettingProps'
    ],
    onReset: ({ columnDefinitions, defaultOrderBy, defaultOrderDirection, defaultPageSize, defaultQuery }) => ({
      orderBy: defaultOrderBy || columnDefinitions[0].id,
      orderDirection: defaultOrderDirection || 'ASC',
      page: 1,
      pageSize: defaultPageSize || 10,
      query: defaultQuery || ''
    }),
    reducerName: 'onChange',
    reducer: (prevState, change) => defaults({}, change, prevState)
  }),

  connect(props => ({
    result: props.get(props)
  }))
)(ServerTablePresenter);
