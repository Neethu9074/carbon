import React from 'react';

export default function JdbcSpanDetailView({span}) {
  return (
    <div>
      {span.getIn(['data', 'jdbc', 'statement'])}
    </div>
  );
}
