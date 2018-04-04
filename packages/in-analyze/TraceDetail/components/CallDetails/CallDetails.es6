import { compose } from 'recompose';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import getSpanTreeNodeDetails from 'in-subscription/application/getSpanTreeNodeDetails';
import TabView from 'in-analyze/TraceDetail/components/CallDetails/components/TabView';
import Header from 'in-analyze/TraceDetail/components/CallDetails/components/Header';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(props => ({
    result: getSpanTreeNodeDetails({ nodeId: props.call.id })
  }))
)(CallDetails);

function CallDetails(props) {
  const { result, onClose } = props;

  const isLoading = get(result, ['progress', 'loading'], false);
  if (isLoading) {
    return 'loading';
  }

  const hasErrors = result.errors.length > 0;
  if (hasErrors) {
    return result.errors;
  }

  const call = result.data;

  return (
    <Fragment>
      <Header call={call} result={result} onClose={onClose} />
      <TabView call={call} />
    </Fragment>
  );
}
