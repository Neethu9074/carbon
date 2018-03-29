import { create } from 'reactive-observables';
import React from 'react';

import TreeHeader from 'in-analyze/TraceDetail/components/CallTree/components/TreeHeader';
import Row from 'in-analyze/TraceDetail/components/CallTree/components/Row';
import createScale from 'in-charts/scale';

import locals from './CallTree.mless';

export default class extends React.Component {
  static displayName = 'CallTree';

  selectedCall$ = create();
  timeoutHandle = null;

  componentDidMount() {
    this.selectedCallSubscription = this.selectedCall$.subscribe(call => {
      if (call) {
        this.timeoutHandle = setTimeout(() => {
          this.selectedCall$.emit(null);
        }, 1000);
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutHandle);

    if (this.selectedCallSubscription) {
      this.selectedCallSubscription.dispose();
      this.selectedCallSubscription = null;
    }
  }

  render() {
    const { rootSpan, getColor = () => '#e6e6e6' } = this.props;
    const scale = createScale();
    scale.setRangeFrom(0);
    scale.setRangeTo(100);
    scale.setDomainFrom(rootSpan.start);
    scale.setDomainTo(rootSpan.start + rootSpan.duration);

    return (
      <div className={locals.callTree}>
        <TreeHeader rootSpan={rootSpan} scale={scale} />
        <Row
          call={rootSpan}
          getColor={getColor}
          scale={scale}
          selectedCall$={this.selectedCall$}
          onCallClicked={call => this.selectedCall$.emit(call)}
        />
      </div>
    );
  }
}
