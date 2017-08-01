import rpt from 'prop-types';
import React from 'react';

import {
  getTypeLabelSingular,
  getTypeLabelPlural,
  shouldShowSelfTime,
  SPAN_KINDS,
  getCategory,
  getLabel
} from 'in-sdk/tracing';
import ServiceImplementationEntityInformation from 'in-views/traceView/components/ServiceImplementationEntityInformation';
import { msZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import SpanServiceInformation from 'in-views/traceView/components/SpanServiceInformation';
import { highlightedSpanId$ } from 'in-views/traceView/stores/highlightedSpan';
import CategoryIcon from 'in-views/traceView/components/tree/CategoryIcon';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import SpanForgeDetails from 'in-components/SpanForgeDetails';
import { hexToRGB } from 'in-services/formatters/color';
import classnames from 'in-services/util/classnames';
import { getSelfTime } from 'in-views/traceView/util';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Badge from 'in-components/Badge';

import './SpanElement.less';

const block = 'in-trace-tree-span-element';

export default connectTo(
  props => {
    const spanId = props.span.get('spanId');
    return {
      isHighlighted: highlightedSpanId$.map(highlightedSpanId => spanId === highlightedSpanId).distinct()
    };
  },
  class extends React.PureComponent {
    static displayName = 'TreeSpanElement';

    static propTypes = {
      span: rpt.object.isRequired,
      trace: rpt.object.isRequired,
      isHighlighted: rpt.bool.isRequired,
      parentSpanForPercentageCalculation: rpt.object.isRequired,
      depth: rpt.number.isRequired,
      totalTimeIndentationDepth: rpt.number.isRequired
    };

    state = {
      detailsExpanded: false
    };

    render() {
      const span = this.props.span;
      const selfTime = getSelfTime(span);
      const batchSize = span.get('batchSize');
      const totalTime = span.get('duration');
      const category = getCategory(span);
      const kind = span.get('kind');
      const categoryColor = spanCategoryColors[category];
      const categoryColorRgb = hexToRGB(categoryColor);
      const backgroundInCategoryColorStyle = { background: categoryColor };

      let totalTimePercentage;
      let selfTimePercentage;
      if (span.get('async')) {
        totalTimePercentage = 0;
        selfTimePercentage = 0;
      } else {
        // add a small amount to avoid division by zero
        const parentTotalTime = this.props.parentSpanForPercentageCalculation.get('duration') + 0.00000001;
        totalTimePercentage = Math.min(1 / parentTotalTime * totalTime, 1);
        selfTimePercentage = Math.min(1 / parentTotalTime * selfTime, 1);
      }

      const borderColor = `rgba(${categoryColorRgb.r}, ${categoryColorRgb.g}, ${categoryColorRgb.b}, 0.5)`;

      return (
        <div>
          <div
            className={`${block}__total-time`}
            style={{
              left: `${this.props.totalTimeIndentationDepth * 20 + 16}px`
            }}
          >
            {msZeroDecimalPlaces(totalTime)}<br />({percentageTwoDecimalPlaces(totalTimePercentage)})
            <div className={`${block}__total-time-indicator`}>
              <div
                className={`${block}__total-time-indicator-bar`}
                style={{
                  width: `${totalTimePercentage * 100}%`
                }}
              />
            </div>

            {span.get('async')
              ? <Tooltip content="Async call">
                  <SvgIcon type="async" className={`${block}__async-icon`} width={14} />
                </Tooltip>
              : null}
          </div>

          <div
            className={classnames({
              [`${block}`]: true,
              [`${block}--error`]: span.get('error'),
              [`${block}--highlighted`]: this.props.isHighlighted
            })}
            style={{
              marginLeft: `${this.props.depth * 20}px`
            }}
            id={`span-${span.get('spanId')}`}
          >
            <div className={`${block}__background`} style={backgroundInCategoryColorStyle} />
            <div className={`${block}__left-border`} style={backgroundInCategoryColorStyle} />
            {span.get('error') ? <SvgIcon type="error" className={`${block}__error-icon`} width={12} /> : null}
            <div className={`${block}__content-wrapper`}>
              <div className={`${block}__header`} onClick={this.toggleDetails}>
                <CategoryIcon category={category} className={`${block}__category-icon`} />
                {(kind !== SPAN_KINDS.EXIT || (batchSize > 1 && selfTime !== totalTime)) && shouldShowSelfTime(span)
                  ? [
                      <div key="0">
                        <span className={`${block}__self-time-label`}>Self: </span>
                        {msZeroDecimalPlaces(selfTime)}<br />({percentageTwoDecimalPlaces(selfTimePercentage)})
                      </div>,
                      <div className={`${block}__horizontal-divider`} key="1" style={backgroundInCategoryColorStyle} />
                    ]
                  : null}

                <div className={`${block}__descriptions`}>
                  <div className={`${block}__span-description`}>
                    <span className={`${block}__span-type`}>
                      {batchSize > 1
                        ? <span><Badge size="sm">{batchSize}</Badge> {getTypeLabelPlural(span)}</span>
                        : getTypeLabelSingular(span)}
                    </span>
                    {' '}
                    {getLabel(span)}
                  </div>

                  <div className={`${block}__entity-description`}>
                    {span.get('kind') === SPAN_KINDS.ENTRY
                      ? <span>
                          <ServiceImplementationEntityInformation
                            span={span}
                            label="From:"
                            connectionEndpointType="source"
                          />
                          <ServiceImplementationEntityInformation span={span} connectionEndpointType="destination" />
                        </span>
                      : <span>
                          <ServiceImplementationEntityInformation span={span} connectionEndpointType="source" />
                          <ServiceImplementationEntityInformation
                            span={span}
                            label="To:"
                            connectionEndpointType="destination"
                          />
                        </span>}
                  </div>
                </div>

                <SvgIcon
                  type={this.state.detailsExpanded ? 'timeline_close' : 'timeline_open'}
                  onClick={this.toggleDetails}
                  className={`${block}__toggle-details`}
                  width={12}
                />
              </div>

              {this.state.detailsExpanded
                ? <div
                    className={`${block}__details`}
                    style={{
                      borderColor
                    }}
                  >
                    <SpanServiceInformation span={span} borderColor={borderColor} />
                    <SpanForgeDetails span={span} trace={this.props.trace} />
                  </div>
                : null}
            </div>
          </div>
        </div>
      );
    }

    toggleDetails = e => {
      e.stopPropagation();
      this.setState(prevState => {
        return {
          detailsExpanded: !prevState.detailsExpanded
        };
      });
    };
  }
);
