import React, { useMemo } from 'react';

import { tagFilterExpressionMatrixParameter, groupByMatrixParameter } from 'in-infrastructure/navigation/paths';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import { ActionSection, Action } from 'in-new-components/workspace/ActionSection/ActionSection';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import GroupedInfrastructure from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { themes } from 'in-new-components/DashboardHeader/DashboardHeader';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { warning, error } from 'in-new-components/Message/types';
import Sections from 'in-new-components/workspace/Sections';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Stack from 'in-new-components/layout/Stack';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';

const urlStateDefinition = {
  bind: [tagFilterExpressionMatrixParameter, groupByMatrixParameter]
};

export default function InfraExploreView() {
  const timeConfig = useTimeConfig();
  const [{ tagFilterExpression, groupBy }, onChange] = useUrlState(urlStateDefinition);
  const validResult = useObservable(isQueryValid(tagFilterExpression), [tagFilterExpression]) ?? pendingResult;
  const backendQueryModel = validResult?.data && toBackendQueryModel(tagFilterExpression);
  const onTagFilterExpressionChange = useMemo(() => {
    return tagFilterExpression => onChange({ tagFilterExpression });
  }, [onChange]);

  return (
    <InfraPageHeaderWithTabs showSearchBar={false} theme={themes.light} addShadow addFooter>
      <ViewTrackingMeta
        data={{
          productArea: 'Infrastructure',
          pageRootName: 'Infra Explore'
        }}
      />

      <Title title="Explore" />
      <LeftRightPadding>
        <Stack>
          <Message type={warning} withIcon small>
            This is a work in progress. The final version of Infra Explore might look nothing like this.
          </Message>

          <Sections>
            <QueryBuilderSection
              value={tagFilterExpression}
              onChange={onTagFilterExpressionChange}
              QueryBuilder={QueryBuilder}
            />

            <ActionSection
              left={
                <>
                  <Action icon="lib_help_error_help_outline">Add grouping</Action>
                  <Action icon="lib_bar_chart">Add chart</Action>
                </>
              }
              right={<ApiQueryAction backendQueryModel={backendQueryModel} />}
            />
          </Sections>

          <DebouncedInput
            type="text"
            id="groupBy"
            value={groupBy}
            autoComplete="off"
            placeholder="Group by... e.g. entity.selfType"
            onChange={value => onChange({ groupBy: value })}
          />

          {validResult.data === false && (
            <Message type={error} withIcon small>
              The filter expression is invalid. Please address the validation failures before continuing.
            </Message>
          )}

          {validResult.data === true && groupBy === '' && (
            <InfrastructureList timeConfig={timeConfig} tagFilterExpression={backendQueryModel} />
          )}

          {validResult.data === true && groupBy !== '' && (
            <GroupedInfrastructure
              timeConfig={timeConfig}
              tagFilterExpression={backendQueryModel}
              groupBy={groupBy.split(',')}
            />
          )}
        </Stack>
      </LeftRightPadding>
    </InfraPageHeaderWithTabs>
  );
}

function DebouncedInput(props) {
  const { value, onChange, ...rest } = props;
  const result = useDebouncedValue(value, onChange);

  return <Input value={result.value} onChange={e => result.onChange(e.target.value)} {...rest} />;
}
