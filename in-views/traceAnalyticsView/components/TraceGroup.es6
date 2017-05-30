import React from 'react';

import InspectTracesForHashButton from 'in-views/traceAnalyticsView/components/InspectTracesForHashButton';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import { number, millis, percentage } from 'in-services/formatters/number';
import SpanForgeDetails from 'in-components/SpanForgeDetails';
import { scrollIntoViewIfNeeded } from 'in-services/util/dom';
import keyCodes from 'in-components/keyCodes';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import './TraceGroup.less';

const allowedKeyCodesForKeydown = [
  keyCodes.arrows.up,
  keyCodes.arrows.down,
  keyCodes.arrows.left,
  keyCodes.arrows.right,
  keyCodes.space
];

const block = 'in-trace-analytics-grouping';
const subGroupingsElement = `${block}__sub-groupings`;
const groupElement = `${block}__group`;
const groupActiveClassName = `${groupElement}--active`;
const groupActiveElement = `${groupElement} ${groupActiveClassName}`;
const typeElement = `${block}__type`;
const typeIconElement = `${block}__type-icon`;
const expandElement = `${block}__toggle-expand`;
const callsElement = `${block}__calls`;
const totalTimeElement = `${block}__total-time`;
const minElement = `${block}__min`;
const avgElement = `${block}__avg`;
const maxElement = `${block}__max`;
const errorsElement = `${block}__errors`;
const errorsPercentageIndicatorElement = `${block}__errors-percentage-indicator`;
const errorCountValueElement = `${block}__error-count`;
const batchedElement = `${block}__batched`;
const callElement = `${block}__call`;
const deepCallElement = `${block}__deep-call`;
const callContentElement = `${block}__call-content`;
const toggleChildrenElement = `${block}__toggle-children`;
const hiddenToggleChildrenElement = `${toggleChildrenElement} ${toggleChildrenElement}--hidden`;
const detailsElement = `${block}__details`;
const expandDetailsElement = `${block}__toggle-expand-details`;
const metricValueElement = `${block}__current-metric-value`;
const labelElement = `${block}__label`;

const traceAnalyticsGroupingsWrapperClassName = 'in-trace-analytics-groupings';

const batchedTooltip = `
Multiple calls were batched into a single span as part of the instrumentation to reduce instrumentation impact. As a result, these numbers are an approximation.
`.trim();
const batchedIndicator = (
  <Tooltip content={batchedTooltip}>
    <span className={batchedElement}>Batched</span>
  </Tooltip>
);

export default class TraceGrouping extends React.Component {
  constructor() {
    super();

    this.state = {
      showChildren: false,
      active: false,
      showDetails: false
    };
  }

  render() {
    const { traceGroup, level, traceGroupsComparator } = this.props;
    const { showChildren, active, showDetails } = this.state;

    return (
      <li className={block}>
        <div
          className={active ? groupActiveElement : groupElement}
          onClick={this.onClick}
          onKeyDown={this.onKeyDown}
          tabIndex={10000}
          ref={this.setDomRef}
        >
          <div className={expandElement}>
            <SvgIcon
              type={showDetails ? 'timeline_close' : 'timeline_open'}
              width={12}
              className={expandDetailsElement}
              onClick={this.toggleDetails}
            />
          </div>
          <div className={level > 0 ? deepCallElement : callElement}>
            <div className={callContentElement} style={traceGroup.enrichment.categoryBackgroundTransparent}>
              <SvgIcon
                type={showChildren ? 'triangle_down' : 'triangle_right'}
                width={showChildren ? 9 : 6}
                onClick={this.toggleChildren}
                className={traceGroup.children.length > 0 ? toggleChildrenElement : hiddenToggleChildrenElement}
              />

              <div className={typeElement} style={traceGroup.enrichment.categoryBackgroundOpaque}>
                <img
                  src={traceGroup.enrichment.categoryIcon}
                  alt={`Icon for spans belonging to the ${traceGroup.enrichment.category} category.`}
                  className={typeIconElement}
                />
              </div>

              <div className={metricValueElement}>
                {`${traceGroup.statistics.durationTotal}ms`}
              </div>
              <div className={metricValueElement}>
                {percentage.compact(traceGroup.enrichment.errorPercentage)}
              </div>
              <div className={metricValueElement}>
                {number.compact(traceGroup.statistics.count)}
              </div>

              {traceGroup.batched ? batchedIndicator : null}

              <span className={labelElement}>
                {traceGroup.enrichment.label}
              </span>
            </div>
          </div>

          {level < 1
            ? <div className={totalTimeElement}>
                {millis.compact(traceGroup.statistics.durationTotal)}
              </div>
            : null}
          {level < 1
            ? <div className={errorsElement}>
                <div
                  className={errorsPercentageIndicatorElement}
                  style={{ width: `${traceGroup.enrichment.errorPercentage * 100}%` }}
                />
                <span className={errorCountValueElement}>
                  {percentage.compact(traceGroup.enrichment.errorPercentage)}
                </span>
              </div>
            : null}

          {level < 1
            ? <div className={callsElement}>
                {number.compact(traceGroup.statistics.count)}
              </div>
            : null}
          <div className={minElement}>
            {millis.compact(traceGroup.statistics.durationMin)}
          </div>
          <div className={avgElement}>
            {millis.compact(traceGroup.statistics.durationMean)}
          </div>
          <div className={maxElement}>
            {millis.compact(traceGroup.statistics.durationMax)}
          </div>
        </div>

        {showDetails
          ? <div
              className={detailsElement}
              style={{ background: traceGroup.enrichment.categoryBackgroundTransparent.background }}
            >
              <div>
                <LabeledValue label="Self">{millis.detailed(traceGroup.statistics.durationSelf)}</LabeledValue>
                <LabeledValue label="50th">{millis.detailed(traceGroup.statistics.duration50th)}</LabeledValue>
                <LabeledValue label="75th">{millis.detailed(traceGroup.statistics.duration75th)}</LabeledValue>
                <LabeledValue label="95th">{millis.detailed(traceGroup.statistics.duration95th)}</LabeledValue>
                <LabeledValue label="98th">{millis.detailed(traceGroup.statistics.duration98th)}</LabeledValue>
                <LabeledValue label="99th">{millis.detailed(traceGroup.statistics.duration99th)}</LabeledValue>

                <InspectTracesForHashButton hash={traceGroup.hash} />
              </div>
              <SpanForgeDetails span={traceGroup.enrichment.fakeSpan} showGroupingDetails />
            </div>
          : null}

        <ol className={subGroupingsElement}>
          {showChildren &&
            traceGroup.children
              .sort(traceGroupsComparator)
              .map(childTraceGroup => (
                <TraceGrouping
                  key={childTraceGroup.hash}
                  traceGroup={childTraceGroup}
                  currentGroupSorting={this.props.currentGroupSorting}
                  level={level + 1}
                  traceGroupsComparator={traceGroupsComparator}
                />
              ))}
        </ol>
      </li>
    );
  }

  getCurrentSortedValue = () => {
    const { traceGroup, currentGroupSorting } = this.props;

    if (currentGroupSorting === 'calls') {
      return number.compact(traceGroup.statistics.count);
    } else if (currentGroupSorting === 'total') {
      return `${traceGroup.statistics.durationTotal}ms`;
    } else if (currentGroupSorting === 'errors') {
      return percentage.compact(traceGroup.enrichment.errorPercentage);
    }
  };

  setDomRef = domElement => {
    this.domElement = domElement;

    // removal case
    if (domElement) {
      domElement.setActive = this.setActive;
    }
  };

  toggleChildren = e => {
    e.stopPropagation();

    this.setState({
      showChildren: !this.state.showChildren
    });
  };

  toggleDetails = e => {
    e.stopPropagation();
    this.setState({
      showDetails: !this.state.showDetails
    });
  };

  onClick = e => {
    e.stopPropagation();
    removeAllOtherActiveStates();
    this.setActive(true);
  };

  onKeyDown = e => {
    if (
      e.target === this.domElement &&
      !keyCodes.isModifierPressed(e) &&
      allowedKeyCodesForKeydown.indexOf(e.keyCode) !== -1
    ) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (e.keyCode === keyCodes.arrows.right) {
      if (this.state.showChildren) {
        this.moveActiveState(1);
      } else {
        this.setState({ showChildren: true });
      }
    } else if (e.keyCode === keyCodes.arrows.left) {
      if (this.state.showChildren) {
        this.setState({ showChildren: false });
      } else {
        this.moveActiveState(-1);
      }
    } else if (e.keyCode === keyCodes.arrows.up) {
      this.moveActiveState(-1);
    } else if (e.keyCode === keyCodes.arrows.down) {
      this.moveActiveState(1);
    } else if (e.keyCode === keyCodes.space) {
      this.setState({
        showDetails: !this.state.showDetails
      });
    }
  };

  moveActiveState(modification) {
    const selector = `.${traceAnalyticsGroupingsWrapperClassName} .${groupElement}`;
    const elements = Array.prototype.slice.call(document.querySelectorAll(selector));
    const newActiveElementIndex = Math.min(
      elements.length - 1,
      Math.max(0, elements.indexOf(this.domElement) + modification)
    );
    removeAllOtherActiveStates();
    elements[newActiveElementIndex].setActive(true);
    elements[newActiveElementIndex].focus();
    scrollIntoViewIfNeeded(elements[newActiveElementIndex]);
  }

  setActive = active => {
    this.setState({ active });
  };
}

function removeAllOtherActiveStates() {
  const selector = `.${traceAnalyticsGroupingsWrapperClassName} .${groupActiveClassName}`;
  const activeElements = document.querySelectorAll(selector);
  for (let i = activeElements.length - 1; i >= 0; i--) {
    activeElements[i].setActive(false);
  }
}
