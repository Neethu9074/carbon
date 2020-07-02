import React, { Fragment } from 'react';

import { ServiceOrEndpoint } from 'in-analyze/components/GroupedTraces/ServiceOrEndpoint';
import { Table, Tbody, Td, Th, Thead, Tr } from 'in-components/tables/sharedComponents';
import LoadingStates from 'in-analyze/AnalyzeView/components/LoadingStates';

import locals from 'in-analyze/components/GroupedTraces/ServiceOrEndpointTable.mless';

export default function ServiceOrEndpointTablePresenter(props) {
  const { totalHits, canLoadMore, progress, errors, renderLinkToAnalyzeAll, createItemLink, items } = props;

  return (
    <Fragment>
      <Table>
        <Thead>
          <Tr size="compact">
            <Th label="Group" noWrap>
              Name
            </Th>
            <Th label="Count" noWrap>
              Violated Calls
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, groupIndex) => (
            <ServiceOrEndpoint key={`${item.name}${groupIndex}`} item={item} createItemLink={createItemLink} />
          ))}
          {canLoadMore && (
            <Tr size="compact">
              <Td colSpan={2}>
                <div className={locals.linkToAnalyseAllCalls}>{renderLinkToAnalyzeAll(totalHits)}</div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <LoadingStates progress={progress} errors={errors} />
    </Fragment>
  );
}
