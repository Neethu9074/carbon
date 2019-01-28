import { pendingResult } from 'in-services/fixedObjects';
import { compose, withProps } from 'recompose';
import { timeout } from 'reactive-observables';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { emptyArray } from 'in-services/fixedObjects';
import withUrlState from 'in-hoc/withUrlState';
import connect from 'in-hoc/connectTo';

export default function createServerTableWithUrlState({
  paginationResettingUrlParameters = emptyArray,
  columnDefinitions,
  defaultOrderBy,
  defaultOrderDirection,
  defaultPageSize,
  defaultQuery,
  pathSegment,
  matrixPrefix = ''
}) {
  return compose(
    withUrlState({
      bind: [
        {
          path: pathSegment,
          name: `${matrixPrefix}orderBy`,
          as: 'orderBy',
          initialState: defaultOrderBy || columnDefinitions[0].id
        },
        {
          path: pathSegment,
          name: `${matrixPrefix}orderDirection`,
          as: 'orderDirection',
          initialState: defaultOrderDirection || 'ASC'
        },
        {
          path: pathSegment,
          name: `${matrixPrefix}page`,
          as: 'page',
          initialState: 1,
          parser: intParser
        },
        {
          path: pathSegment,
          name: `${matrixPrefix}pageSize`,
          as: 'pageSize',
          initialState: defaultPageSize || 20,
          parser: intParser
        },
        {
          path: pathSegment,
          name: `${matrixPrefix}query`,
          as: 'query',
          initialState: defaultQuery || ''
        }
      ],

      resets: [
        {
          bind: paginationResettingUrlParameters,
          reset: { page: 1 }
        }
      ],

      // function to set the new page/order/query
      reducerName: 'onChange'
    }),
    connect((props, prevProps) => {
      if (props.query !== prevProps.query && props.query !== '') {
        // Query changes are frequent and we need to debounce these changes.
        // Also, while debouncing, we immediately want to turn the table state
        // into a loading state. This is better than having the state of an input
        // field and the state of the table differ (happens when debouncing within an input
        // field and the table is still showing data for a previous query).
        //
        // The combination of a connectTo() and a timeout().flatMap is effectively
        // a debounce implementation!
        //
        // Because we are debouncing only on query changes and because we are turning
        // the table immediately into a loading state, we can use larger waiting times
        // before retrieving data and thereby reduce backend pressure!
        return {
          result: timeout(800)
            .flatMap(() => props.get(props))
            .startWith(pendingResult)
        };
      }
      return {
        result: props.get(props)
      };
    }),
    withProps({
      columnDefinitions
    })
  )(ServerTablePresenter);
}
