import React from 'react';

export default class TraceGrouping extends React.Component {
  constructor() {
    super();

    this.state = {
      showChildren: false
    };
  }

  render() {
    const { traceGroup } = this.props;

    return (
      <li>
        {traceGroup.enrichment.label}

        <ol>
          {traceGroup.children.map(childTraceGroup =>
            <TraceGrouping key={childTraceGroup.hash} traceGroup={childTraceGroup} />
          )}
        </ol>
      </li>
    );
  }
}
