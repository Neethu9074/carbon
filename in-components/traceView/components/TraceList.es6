import React from 'react';

import TraceTableHeader from 'in-components/traceView/components/TraceTableHeader';
import TraceHeading from 'in-components/traceView/components/TraceHeading';
import TraceTable from 'in-components/traceView/components/TraceTable';
import {Row, Col} from 'in-components/Grid';

import './TraceList.less';

const block = 'in-trace-list';

export default React.createClass({
  displayName: 'TraceList',

  render() {
    return (
      <div className={block}>
        <Row className={block + '__header'}>
          <Col cols={6}
               className={block + '__title'}>
            <TraceHeading>
              Traces{' '}
            </TraceHeading>
          </Col>
          <Col cols={6}
               className={block + '__controls'}>
            Update…
          </Col>
        </Row>

        <TraceTableHeader />
        <TraceTable />
      </div>
    );
  }
});
