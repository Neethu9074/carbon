import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {getSelfTime} from 'in-components/traceView/util';
import {highlightedSpanId$} from 'in-components/traceView/traceViewStore';
import {msZeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
// import SpanEntityInformation from 'in-components/traceView/components/SpanEntityInformation';
import {getLabel, getCategory, getCategoryIcon} from 'in-sdk/tracing';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import classnames from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';

import './SpanElement.less';

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
    const span = this.props.span;
    const selfTime = getSelfTime(span);
    const totalTime = span.get('duration');
    const category = getCategory(span);
    const categoryColor = spanCategoryColors[category];
    const backgroundInCategoryColorStyle = {background: categoryColor};

    let totalTimePercentage;
    let selfTimePercentage;
    if (span.get('async')) {
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
               [`${block}--error`]: span.get('error'),
               [`${block}--highlighted`]: this.props.isHighlighted
             })}
             onClick={this.toggleDetails}>
          <div className={`${block}__background`}
                style={backgroundInCategoryColorStyle}/>
          <div className={`${block}__left-border`}
                style={backgroundInCategoryColorStyle}/>
          <div className={`${block}__content-wrapper`}>
            <div className={`${block}__header`}>
              <img src={getCategoryIcon(category)}
                   alt={`Icon for the span category ${category}`}
                   className={`${block}__category-icon`}
                   style={backgroundInCategoryColorStyle}/>

              <div className={`${block}__self-time`}>
                <span className={`${block}__self-time-label`}>Self: </span>
                {msZeroDecimalPlaces(selfTime)}<br/>({percentageTwoDecimalPlaces(selfTimePercentage)})
              </div>

              <div className={`${block}__horizontal-divider`}
                   style={backgroundInCategoryColorStyle} />

              {getLabel(span)} ({totalTimePercentage} {selfTimePercentage})
            </div>
          </div>
        </div>
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


// {this.state.detailsExpanded ?
//   <SpanForgeDetails span={this.props.span}
//                     trace={this.props.trace} />
// : null}
//
//
//
// Self: {msZeroDecimalPlaces(selfTime)} ({percentageTwoDecimalPlaces(selfTimePercentage)})
// <br />
// {getTypeLabelSingular(this.props.span)}: {getLabel(this.props.span)}
// <br />
// Total: {msZeroDecimalPlaces(totalTime)} ({percentageTwoDecimalPlaces(totalTimePercentage)})
// <br/>
//
// {getDirection(this.props.span) === 'entry' ?
//   <span>
//     <SpanEntityInformation span={this.props.span}
//                            label='From'
//                            connectionEndpointType='sourceId' />
//     <SpanEntityInformation span={this.props.span}
//                            label='On'
//                            connectionEndpointType='destinationId' />
//   </span>
// :
//   <span>
//     <SpanEntityInformation span={this.props.span}
//                            label='On'
//                            connectionEndpointType='sourceId' />
//     <SpanEntityInformation span={this.props.span}
//                            label='To'
//                            connectionEndpointType='destinationId' />
//   </span>
// }
//
// {this.props.span.get('async') ?
//   <span className={`${block}__async-marker`}>
//     &#x21C4;
//   </span>
// : null}
