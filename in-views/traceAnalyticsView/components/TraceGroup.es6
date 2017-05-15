import React from 'react';

import InspectTracesForHashButton from 'in-views/traceAnalyticsView/components/InspectTracesForHashButton';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import { number, millis, percentage } from 'in-services/formatters/number';
import SpanForgeDetails from 'in-components/SpanForgeDetails';
import keyCodes from 'in-components/keyCodes';
import SvgIcon from 'in-components/SvgIcon';

import './TraceGroup.less';

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
const callElement = `${block}__call`;
const toggleChildrenElement = `${block}__toggle-children`;
const hiddenToggleChildrenElement = `${toggleChildrenElement} ${toggleChildrenElement}--hidden`;
const detailsElement = `${block}__details`;

const traceAnalyticsGroupingsWrapperClassName = 'in-trace-analytics-groupings';

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
          style={traceGroup.enrichment.categoryBackgroundTransparent}
          onClick={this.onClick}
          onKeyDown={this.onKeyDown}
          tabIndex={10000}
          ref={this.setDomRef}
        >
          <div className={expandElement}>
            <SvgIcon
              type={showDetails ? 'timeline_close' : 'timeline_open'}
              width={12}
              className={`${block}__toggle-expand-details`}
              onClick={this.toggleDetails}
            />
          </div>
          <div className={callsElement}>
            {number.compact(traceGroup.statistics.count)}
          </div>
          <div className={totalTimeElement}>
            {millis.compact(traceGroup.statistics.durationTotal)}
          </div>
          <div className={minElement}>
            {millis.compact(traceGroup.statistics.durationMin)}
          </div>
          <div className={avgElement}>
            {millis.compact(traceGroup.statistics.durationMean)}
          </div>
          <div className={maxElement}>
            {millis.compact(traceGroup.statistics.durationMax)}
          </div>
          <div className={errorsElement}>
            <div
              className={errorsPercentageIndicatorElement}
              style={{ width: `${traceGroup.enrichment.errorPercentage * 100}%` }}
            />
            <span className={errorCountValueElement}>
              {percentage.compact(traceGroup.enrichment.errorPercentage)}
            </span>
          </div>
          <div
            className={callElement}
            style={{
              textIndent: `${level * 20}px`
            }}
          >

            <SvgIcon
              type={showChildren ? 'triangle_down' : 'triangle_right'}
              width={showChildren ? 11 : 8}
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

            {traceGroup.enrichment.label}
          </div>
        </div>

        {showDetails
          ? <div className={detailsElement} style={traceGroup.enrichment.categoryBackgroundTransparent}>
              <div>
                <LabeledValue label="Self">{millis.detailed(traceGroup.statistics.durationSelf)}</LabeledValue>
                <LabeledValue label="50th">{millis.detailed(traceGroup.statistics.duration50th)}</LabeledValue>
                <LabeledValue label="75th">{millis.detailed(traceGroup.statistics.duration75th)}</LabeledValue>
                <LabeledValue label="95th">{millis.detailed(traceGroup.statistics.duration95th)}</LabeledValue>
                <LabeledValue label="98th">{millis.detailed(traceGroup.statistics.duration98th)}</LabeledValue>
                <LabeledValue label="99th">{millis.detailed(traceGroup.statistics.duration99th)}</LabeledValue>

                <InspectTracesForHashButton hash={traceGroup.hash} />
              </div>
              <SpanForgeDetails span={traceGroup.enrichment.fakeSpan} />
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
                  level={level + 1}
                  traceGroupsComparator={traceGroupsComparator}
                />
              ))}
        </ol>
      </li>
    );
  }

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
    e.stopPropagation();
    e.preventDefault();

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
    elements[newActiveElementIndex].scrollIntoViewIfNeeded();
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
