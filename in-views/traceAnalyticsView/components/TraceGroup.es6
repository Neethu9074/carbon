import React from 'react';

import {number, millis} from 'in-services/formatters/number';

import './TraceGroup.less';

const block = 'in-trace-analytics-grouping';
const subGroupingsElement = `${block}__sub-groupings`;
const groupElement = `${block}__group`;
const typeElement = `${block}__type`;
const typeIconElement = `${block}__type-icon`;
const typeIconWrapperElement = `${block}__type-icon-wrapper`;
const callsElement = `${block}__calls`;
const totalTimeElement = `${block}__total-time`;
const minElement = `${block}__min`;
const maxElement = `${block}__max`;
const errorsElement = `${block}__errors`;
const callElement = `${block}__call`;

export default class TraceGrouping extends React.Component {
  constructor() {
    super();

    this.state = {
      showChildren: false
    };
  }

  render() {
    const { traceGroup, level } = this.props;

    return (
      <li className={block}>
        <div className={groupElement}
             style={traceGroup.enrichment.categoryBackgroundTransparent}>
          <div className={typeElement}>
            <div className={typeIconWrapperElement}
                 style={traceGroup.enrichment.categoryBackgroundOpaque}>
              <img src={traceGroup.enrichment.categoryIcon}
                alt={`Icon for spans belonging to the ${traceGroup.enrichment.category} category.`}
                className={typeIconElement} />
            </div>
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
            {traceGroup.enrichment.label}
          </div>
        </div>

        <ol className={subGroupingsElement}>
          {traceGroup.children.map(childTraceGroup =>
            <TraceGrouping key={childTraceGroup.hash} traceGroup={childTraceGroup} level={level + 1} />
          )}
        </ol>
      </li>
    );
  }
}
