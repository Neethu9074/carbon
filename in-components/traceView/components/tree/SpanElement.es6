import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {getSelfTime} from 'in-components/traceView/util';
import {highlightedSpanId$} from 'in-components/traceView/traceViewStore';
import {msZeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import SpanEntityInformation from 'in-components/traceView/components/SpanEntityInformation';
import {getLabel, getTypeLabelSingular, getCategory, getDirection} from 'in-sdk/tracing';
import SpanForgeDetails from 'in-components/traceView/components/SpanForgeDetails';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import classnames from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';

const block = 'in-trace-tree-span-element';

export default connectTo(props => {
  const spanId = props.span.get('spanId');
  return {
    isHighlighted: highlightedSpanId$
      .map(highlightedSpanId => spanId === highlightedSpanId)
      .distinct()
  };
}, React.createClass({
  displayName: 'TreeSpanElement',

  mixins: [PureRenderMixin],

  propTypes: {
    span: React.PropTypes.object.isRequired,
    trace: React.PropTypes.object.isRequired,
    isHighlighted: React.PropTypes.bool.isRequired,
    parentSpanForPercentageCalculation: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      detailsExpanded: false
    };
  },

  render() {
    const selfTime = getSelfTime(this.props.span);
    const totalTime = this.props.span.get('duration');

    let totalTimePercentage;
    let selfTimePercentage;
    if (this.props.span.get('async')) {
      totalTimePercentage = 0;
      selfTimePercentage = 0;
    } else {
      // add a small amount to avoid division by zero
      const parentTotalTime = this.props.parentSpanForPercentageCalculation.get('duration') + 0.00000001;
      totalTimePercentage = 1 / parentTotalTime * totalTime;
      selfTimePercentage = 1 / parentTotalTime * selfTime;
    }

    return (
      <div>
        <div className={classnames({
               [`${block}`]: true,
               [`${block}--error`]: this.props.span.get('error'),
               [`${block}--highlighted`]: this.props.isHighlighted
             })}
             onClick={this.toggleDetails}>
          <span className={`${block}__element-type-indicator`}
                style={{
                  background: spanCategoryColors[getCategory(this.props.span)]
                }}/>

          <div className={`${block}-row ${block}-row--top`}>
            Self: {msZeroDecimalPlaces(selfTime)} ({percentageTwoDecimalPlaces(selfTimePercentage)})

            <span style={{position: 'absolute', left: '150px'}}>
              {getTypeLabelSingular(this.props.span)}:
              &nbsp;
              {getLabel(this.props.span)}
            </span>
          </div>
          <div className={`${block}-row ${block}-row--bottom`}>
            Total: {msZeroDecimalPlaces(totalTime)} ({percentageTwoDecimalPlaces(totalTimePercentage)})

            <span style={{position: 'absolute', left: '150px'}}>
              {getDirection(this.props.span) === 'entry' ?
                <span>
                  <SpanEntityInformation span={this.props.span}
                                         label='From'
                                         connectionEndpointType='sourceId' />
                  <SpanEntityInformation span={this.props.span}
                                         label='On'
                                         connectionEndpointType='destinationId' />
                </span>
              :
                <span>
                  <SpanEntityInformation span={this.props.span}
                                         label='On'
                                         connectionEndpointType='sourceId' />
                  <SpanEntityInformation span={this.props.span}
                                         label='To'
                                         connectionEndpointType='destinationId' />
                </span>
              }
            </span>
          </div>

          {this.props.span.get('async') ?
            <span className={`${block}__async-marker`}>
              &#x21C4;
            </span>
          : null}
        </div>

        {this.state.detailsExpanded ?
          <SpanForgeDetails span={this.props.span}
                            trace={this.props.trace} />
        : null}
      </div>
    );
  },

  toggleDetails() {
    this.setState(prevState => {
      return {
        detailsExpanded: !prevState.detailsExpanded
      };
    });
  }
}));
