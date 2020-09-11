import React, { useMemo } from 'react';

import CallGroupingConfigurator, {
  isCallGroupingConfigurationValid
} from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import CallQueryBuilder, { isCallQueryValid } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import { tagFilterExpressionMatrixParameter, groupMatrixParameter } from 'in-applications/navigation/matrix';
import FixatedTimeConfigContextModification from 'in-stores/time/FixatedTimeConfigContextModification';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import { ActionSection, Action } from 'in-new-components/workspace/ActionSection/ActionSection';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { warning, error } from 'in-new-components/Message/types';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-new-components/workspace/Sections';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import Stack from 'in-new-components/layout/Stack';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

const urlStateDefinition = {
  bind: [tagFilterExpressionMatrixParameter, groupMatrixParameter]
};

export default function ApplicationAnalyzeView() {
  return (
    <FixatedTimeConfigContextModification>
      {({ refresh }) => <ApplicationAnalyzeViewWithFixatedTimeConfig refreshFixatedTimeConfig={refresh} />}
    </FixatedTimeConfigContextModification>
  );
}

function ApplicationAnalyzeViewWithFixatedTimeConfig() {
  const timeConfig = useTimeConfig();
  const [{ tagFilterExpression, group }, onChange] = useUrlState(urlStateDefinition);

  const validTagFilterExpressionResult =
    useObservable(isCallQueryValid(tagFilterExpression, timeConfig), [tagFilterExpression]) ?? pendingResult;
  const validGroupResult = useObservable(isCallGroupingConfigurationValid(group, timeConfig), [group]) ?? pendingResult;
  // in case of a pending result (validTagFilterExpressionResult.data === null) we do not want to show the user an error message
  const isValid = validTagFilterExpressionResult.data === true && validGroupResult.data === true;
  const isInvalid = validTagFilterExpressionResult.data === false && validGroupResult.data === false;

  const backendQueryModel = isValid && toBackendQueryModel(tagFilterExpression);

  const onTagFilterExpressionChange = useMemo(() => tagFilterExpression => onChange({ tagFilterExpression }), [
    onChange
  ]);
  const onGroupChange = useMemo(() => {
    return group => {
      return onChange({ group });
    };
  }, [onChange]);

  return (
    <Sticky header={<AnalyzeHeader isGrouped={Boolean(group?.groupbyTag)} />}>
      <LeftRightPadding>
        <Stack>
          <Message type={warning} withIcon small>
            This is a work in progress. The final version of UA2 might look nothing like this.
          </Message>

          <Sections>
            <QueryBuilderSection
              value={tagFilterExpression}
              onChange={onTagFilterExpressionChange}
              QueryBuilder={CallQueryBuilder}
            />

            <GroupingConfiguratorSection
              value={group}
              onChange={onGroupChange}
              GroupingConfigurator={CallGroupingConfigurator}
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
            />

            <ActionSection
              left={
                <>
                  <Action icon="lib_bar_chart">Add chart</Action>
                </>
              }
              right={<ApiQueryAction backendQueryModel={backendQueryModel} />}
            />
          </Sections>

          {isInvalid && (
            <Message type={error} withIcon small>
              The query configuration is invalid. Please address the validation failures before continuing.
            </Message>
          )}

          {isValid && !group?.groupbyTag && <p>Show ungrouped result</p>}

          {isValid && group?.groupbyTag && <p>Show grouped result</p>}
        </Stack>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}
