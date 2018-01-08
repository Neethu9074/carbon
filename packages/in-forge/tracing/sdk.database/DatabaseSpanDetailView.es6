import React from 'react';

import CustomDataDescriptionItem from 'in-forge/tracing/sdk/CustomDataDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function DatabaseSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Instance">{span.getIn(['data', 'db', 'instance'])}</DescriptionItem>
        <DescriptionItem title="Type">{span.getIn(['data', 'db', 'type'])}</DescriptionItem>
        <DescriptionItem title="User">{span.getIn(['data', 'db', 'user'])}</DescriptionItem>

        <Statement span={span} />
        <CustomDataDescriptionItem span={span} />
      </DescriptionList>
    </div>
  );
}

function Statement({ span }) {
  const statement = span.getIn(['data', 'db', 'statement']);
  if (!statement) {
    return null;
  }

  let lang = 'plain';
  let code = statement;

  if (span.getIn(['data', 'db', 'type']) === 'sql') {
    lang = 'sql';
    code = formatSql(statement);
  } else if (typeof statement === 'object') {
    lang = 'json';
    code = JSON.stringify(statement, 0, 2);
  } else {
    try {
      code = JSON.stringify(JSON.parse(statement), 0, 2);
      lang = 'json';
    } catch (e) {
      // we have no idea what kind of data the users are providing for the statement. It is just a guess that this
      // might be JSON (for Elasticsearch or Mongo)
    }
  }

  return <Code code={code} lang={lang} />;
}
