import React from 'react';

import {number, millis} from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import './TraceGroup.less';

const block = 'in-trace-analytics-grouping';
const subGroupingsElement = `${block}__sub-groupings`;
const groupElement = `${block}__group`;
const typeElement = `${block}__type`;
const typeIconElement = `${block}__type-icon`;
const callsElement = `${block}__calls`;
const totalTimeElement = `${block}__total-time`;
const minElement = `${block}__min`;
const avgElement = `${block}__avg`;
const maxElement = `${block}__max`;
const errorsElement = `${block}__errors`;
const callElement = `${block}__call`;
const toggleChildrenElement = `${block}__toggle-children`;

export default class TraceGrouping extends React.Component {
  constructor() {
    super();

    this.state = {
      showChildren: false
    };
  }

  render() {
    const { traceGroup, level, traceGroupsComparator } = this.props;
    const { showChildren } = this.state;

    return (
      <li className={block}>
        <div className={groupElement}
             style={traceGroup.enrichment.categoryBackgroundTransparent}>
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
            {millis.compact(traceGroup.statistics.durationAvg)}
          </div>
          <div className={maxElement}>
            {millis.compact(traceGroup.statistics.durationMax)}
          </div>
          <div className={errorsElement}>
            {number.compact(traceGroup.statistics.errorCount)}
          </div>
          <div className={callElement}
              style={{
                paddingLeft: `${level * 20}px`
              }}>

            {traceGroup.children.length > 0 ?
              <SvgIcon type="triangle_right"
                       width={16}
                       onClick={this.toggle}
                       className={toggleChildrenElement} />
            : null}

            <div className={typeElement}
                 style={traceGroup.enrichment.categoryBackgroundOpaque}>
              <img src={traceGroup.enrichment.categoryIcon}
                alt={`Icon for spans belonging to the ${traceGroup.enrichment.category} category.`}
                className={typeIconElement} />
            </div>

            {traceGroup.enrichment.label}
          </div>
        </div>

        <ol className={subGroupingsElement}>
          {showChildren && traceGroup.children.sort(traceGroupsComparator).map(childTraceGroup =>
            <TraceGrouping key={childTraceGroup.hash} traceGroup={childTraceGroup} level={level + 1} />
          )}
        </ol>
      </li>
    );
  }

  toggle = () => {
    this.setState({
      showChildren: !this.state.showChildren
    });
  }
}
