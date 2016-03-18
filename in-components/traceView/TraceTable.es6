import 'fixed-data-table/dist/fixed-data-table-base.css';
import 'fixed-data-table/dist/fixed-data-table-style.css';
import {Table, Column, Cell} from 'fixed-data-table';
import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {getTraces} from 'in-stores/traces';

const block = 'in-trace-view__trace-table';

const TextCell = ({rowIndex, data, col}) => (
  <Cell>{data[rowIndex][col]}</Cell>
);

export default React.createClass({
  displayName: 'TraceTable',

  getInitialState() {
    return {
      traces: []
    };
  },

  componentWillMount() {
    this.traceSubscription = getTraces().once(this.addTraces);
  },

  addTraces(newTraces) {
    const transformedTraces = newTraces.toArray().map(trace => {
      return {
        start: formatDateTime(trace.get('start')),
        duration: msZeroDecimalPlaces(trace.get('duration')),
        name: trace.get('name')
      };
    });

    this.setState(state => {
      return {
        traces: state.traces.concat(transformedTraces)
      };
    });
  },

  componentWillUnmount() {
    this.traceSubscription.dispose();
  },

  render() {
    return (
      <div className={block}>
        <Table rowHeight={50}
               headerHeight={50}
               rowsCount={this.state.traces.length}
               width={1000}
               height={500}>
          <Column header={<Cell>Timestamp</Cell>}
                  cell={<TextCell data={this.state.traces} col='start'/>}
                  width={200}
                  fixed={true}/>
          <Column header={<Cell>Duration</Cell>}
                  cell={<TextCell data={this.state.traces} col='duration'/>}
                  width={200}
                  fixed={true}/>
          <Column header={<Cell>Name</Cell>}
                  cell={<TextCell data={this.state.traces} col='name'/>}
                  width={200}
                  flexGrow={2}/>
        </Table>
      </div>
    );
  }
});
