import React from 'react';

import {refresh} from 'in-components/traceView/traceViewStore';
import TraceTableHeader from 'in-components/traceView/components/TraceTableHeader';
import TraceHeading from 'in-components/traceView/components/TraceHeading';
import AutoUpdate from 'in-components/traceView/components/AutoUpdate';
import TraceTable from 'in-components/traceView/components/TraceTable';
import {Row, Col} from 'in-components/Grid';
import Icon from 'in-components/Icon';

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
            <Icon type='reload'
                  onClick={refresh}
                  className={block + '__reload'}/>
            <AutoUpdate />
          </Col>
        </Row>

        <TraceTableHeader />
        <TraceTable />
      </div>
    );
  }
});
