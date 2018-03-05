import React from 'react';

import Row from 'in-applications/Dashboards/commonComponents/TopTraces/Row';

import locals from './List.mless';

export default function TopListPresenter(props) {
  const { result } = props;
  return <ol className={locals.topList}>{result.data.map((item, i) => <Row key={i} {...props} item={item} />)}</ol>;
}
