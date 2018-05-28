import React from 'react';

import NoContent from 'in-components/Chart/components/NoContent';
import { evaluateClassNames } from 'in-services/util/classnames';
import List from 'in-new-components/TopListCard/List';
import Card from 'in-new-components/Card';

import locals from './TopListCardPresenter.mless';

export default function TopListCard(props) {
  const { result, title, metrics, labels, onChangeMetric, selectedMetric, List: ListRenderer = List } = props;

  const header = metrics.length > 1 && (
    <ul className={locals.metrics}>
      {metrics.map((metric, i) => (
        <li key={metric} className={locals.metric}>
          <a
            className={evaluateClassNames({
              [locals.metricLink]: true,
              [locals.active]: selectedMetric === metric
            })}
            href="#"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onChangeMetric(metric);
            }}
          >
            {labels[i]}
          </a>
        </li>
      ))}
    </ul>
  );

  let content;
  let withoutPadding = false;
  const height = 160;

  if (result.progress.loading) {
    content = <NoContent height={height} isLoading />;
    withoutPadding = true;
  } else if (result.errors.length > 0) {
    content = <NoContent height={height} errors={result.errors} />;
  } else if ((result.data instanceof Array && result.data.length === 0) || result.data.totalHits === 0) {
    content = <div className={locals.noDataFound}>No data available.</div>;
  } else {
    content = <ListRenderer {...props} />;
  }

  return (
    <Card title={title} header={header} withoutPadding={withoutPadding}>
      {content}
    </Card>
  );
}
