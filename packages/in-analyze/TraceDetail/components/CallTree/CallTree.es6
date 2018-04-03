import { create } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import TreeHeader from 'in-analyze/TraceDetail/components/CallTree/components/TreeHeader';
import LoadingCallTree from 'in-analyze/TraceDetail/components/CallTree/LoadingCallTree';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
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
    const { spanTreeResult, getColor = () => '#e6e6e6' } = this.props;

    const isLoading = get(spanTreeResult, ['progress', 'loading'], false);
    if (isLoading) {
      return <LoadingCallTree progress={spanTreeResult.progress} />;
    }

    const hasErrors = spanTreeResult.errors.length > 0;
    if (hasErrors) {
      return <ErroneousResultPresenter errors={spanTreeResult.errors} />;
    }

    const rootCall = spanTreeResult.data;

    const scale = createScale();
    scale.setRangeFrom(0);
    scale.setRangeTo(100);
    scale.setDomainFrom(rootCall.start);
    scale.setDomainTo(rootCall.start + rootCall.duration);

    return (
      <div className={locals.callTree}>
        <TreeHeader rootCall={rootCall} scale={scale} />
        <Row
          call={rootCall}
          getColor={getColor}
          scale={scale}
          selectedCall$={this.selectedCall$}
          onCallClicked={call => this.selectedCall$.emit(call)}
        />
      </div>
    );
  }
}
