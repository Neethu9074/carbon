import { storiesOf } from '@storybook/react';
import React from 'react';

import WorldMapCardPresenter from 'in-websites/WorldMapCard/WorldMapCardPresenter';
import { pendingResult } from 'in-services/fixedObjects';
import {Row, Col} from 'in-new-components/layout/Grid';

import Root from '../_helpers/Root';

storiesOf('Websites/World Map Card', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <Row>
        <Col xs={6}>
          <WorldMapCardPresenter title="Pending" height={300} countryBreakdownResult={pendingResult} />
        </Col>
        <Col xs={6}>
          <WorldMapCardPresenter title="Errors" height={300} countryBreakdownResult={{
            data: null,
            time: 1542112104261,
            errors: [
              {
                message: 'Unexpected server error',
                code: 'SERVER'
              }
            ],
            progress: { percentage: null, loading: false, note: null }
          }} />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <WorldMapCardPresenter title="No Data" height={300} countryBreakdownResult={{
            data: {
              items: [],
              page: 1,
              pageSize: 200,
              totalHits: 0
            },
            time: 1542112104261,
            errors: [],
            progress: { percentage: null, loading: false, note: null }
          }} />
        </Col>
        <Col xs={6}>
          <WorldMapCardPresenter title="With Data" height={300} countryBreakdownResult={{
            data: {
              items: [
                { continent: 'North America', country: 'Canada', pageLoads: 311, onLoadTime: 234 },
                { continent: 'Asia', country: 'China', pageLoads: 364, onLoadTime: 239 },
                { continent: 'Africa', country: 'Egypt', pageLoads: 342, onLoadTime: 333 },
                { continent: 'Europe', country: 'France', pageLoads: 334, onLoadTime: 269 },
                { continent: 'Asia', country: 'Japan', pageLoads: 325, onLoadTime: 190 },
                { continent: 'Europe', country: 'Russia', pageLoads: 376, onLoadTime: 1592 },
                { continent: 'Europe', country: 'United Kingdom', pageLoads: 373, onLoadTime: 335 },
                { continent: 'North America', country: 'United States', pageLoads: 676, onLoadTime: 549 }
              ],
              page: 1,
              pageSize: 200,
              totalHits: 8
            },
            time: 1542112104261,
            errors: [],
            progress: { percentage: null, loading: false, note: null }
          }} />
        </Col>
      </Row>
    </Root>
  );
}
