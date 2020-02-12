import { compose, withState, setPropTypes } from 'recompose';
import rpt from 'prop-types';
import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import LightCard from 'in-new-components/Card/LightCard';
import SearchInput from 'in-new-components/SearchInput';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './TopListWidget.mless';

export default compose(
  setPropTypes({
    title: rpt.string.isRequired,
    getData: rpt.func.isRequired,
    columnDefinitions: rpt.array.isRequired,
    icon: rpt.string,
    header: rpt.object,
    fullListView$: rpt.object,
    fullListViewLinkTitle: rpt.string
  }),
  withState('query', 'setQuery', ''),
  connectTo(({ getData, query }) => ({
    timeConfig: timeConfig$,
    result: timeConfig$.flatMap(timeConfig => getData({ timeConfig, query })).map(result => {
      if (result.data && result.data.items) {
        return {
          ...result,
          data: {
            ...result.data,
            items: result.data.items.slice(0, 5)
          }
        };
      }
      return result;
    })
  }))
)(TopListWidget);

function TopListWidget({
  query,
  setQuery,
  title,
  timeConfig,
  result,
  header,
  icon,
  columnDefinitions,
  fullListView$,
  fullListViewLinkTitle
}) {
  return (
    <LightCard
      title={title}
      icon={icon}
      useMaxAvailableHeight
      rightHeaderContent={
        <>
          {header}
          <SearchInput width={250} query={query} placeholder="" onChange={query => setQuery(query)} />
        </>
      }
      bodyClassName={locals.content}
    >
      <ServerTablePresenter
        isSearchable={false} // is handled through this component
        columnDefinitions={columnDefinitions}
        result={result}
        timeConfig={timeConfig}
        numSkeletonRows={5}
      />
      <Link className={locals.link} href$={fullListView$}>
        {fullListViewLinkTitle}
      </Link>
    </LightCard>
  );
}
