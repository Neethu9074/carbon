/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { expect } from 'chai';

import { getUpdatedOrder } from 'in-infrastructure/Explore/utils';

const my_metric = { metric: 'my_metric', aggregation: 'MEAN', crossSeriesAggregation: 'MEAN' };
const other_metric = { metric: 'other_metric', aggregation: 'SUM', crossSeriesAggregation: 'SUM' };

describe('getUpdatedOrder', () => {
  it('must return the same order if metric is still present', () => {
    const newOrder = getUpdatedOrder(
      { by: 'my_metric.MEAN.MEAN', direction: 'DESC' },
      [my_metric, other_metric],
      ['zone']
    );
    expect(newOrder).to.deep.equal({ by: 'my_metric.MEAN.MEAN', direction: 'DESC' });
  });

  it('must use default grouping order in same direction if metric is no longer present', () => {
    const newOrder = getUpdatedOrder({ by: 'my_metric.MEAN.MEAN', direction: 'DESC' }, [other_metric], ['zone']);
    expect(newOrder).to.deep.equal({ by: 'zone', direction: 'DESC' });
  });

  it('must use same order if group is still present', () => {
    const newOrder = getUpdatedOrder({ by: 'zone', direction: 'DESC' }, [other_metric], ['zone']);
    expect(newOrder).to.deep.equal({ by: 'zone', direction: 'DESC' });
  });

  it('must use default order if there is no grouping', () => {
    const newOrder = getUpdatedOrder({ by: 'zone', direction: 'DESC' }, [other_metric], []);
    expect(newOrder).to.deep.equal({ by: 'label', direction: 'ASC' });
  });
});
