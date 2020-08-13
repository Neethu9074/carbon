import { compose, setPropTypes } from 'recompose';
import rpt from 'prop-types';
import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import connectTo from 'in-hoc/connectTo';

export default compose(
  setPropTypes({
    getItems: rpt.func.isRequired,
    columnDefinitions: rpt.array.isRequired,
    rightHeader: rpt.node,
    EmptyStateComponent: rpt.func
  }),
  connectTo(({ getItems }) => ({
    result: getItems()
  }))
)(SliList);

function SliList(props) {
  const { columnDefinitions, rightHeader } = props;
  return (
    <ServerTablePresenter
      isSearchable={false}
      orderDirection="ASC"
      cardTitle="Service Level Indicators"
      rightHeader={rightHeader}
      {...props}
      numSkeletonRows={3}
      columnDefinitions={columnDefinitions}
    />
  );
}
