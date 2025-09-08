/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { isArray, lowerCase } from 'lodash';
import React, { useState } from 'react';

import { Layer, ListItem, Stack, UnorderedList } from '@instana/carbon';
import { Widget } from '@instana/types';

import {
  FilterListItem,
  FilterSuggestions,
  SimpleListItem,
  SimpleSuggestionDropDown
} from 'in-custom-dashboards/CustomDashboard/AiChat/Messages/ConfigMessage';
import {
  CommonPossibleConfig,
  CommonInferredConfig,
  FinalConfig
} from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { WidgetPreviewWithSlots } from 'in-custom-dashboards/CustomDashboard/AiChat/Messages/WidgetPreviewWithSlots';
import { useCommonSuggestions } from 'in-custom-dashboards/CustomDashboard/AiChat/hooks/useCommonSuggestions';
import { toInputConfig } from 'in-custom-dashboards/CustomDashboard/AiChat/Messages/utils';

interface Props {
  widgetType: 'bigNumber' | 'TIME_SERIES';
  inferredConfig: CommonInferredConfig;
  possibleConfig: CommonPossibleConfig | null;
  onAddPromptedWidget: (widget: Widget) => void;
}

export const CommonConfigMessage = ({ widgetType, inferredConfig, possibleConfig, onAddPromptedWidget }: Props) => {
  const [configState, setConfigState] = useState(inferredConfig);

  const areAllSlotsFilled = Boolean(configState.aggregation && configState.metric && configState.filter);

  const suggestions = useCommonSuggestions(inferredConfig, possibleConfig);
  const { aggregations: aggregation, metrics: metric, filters: filter } = suggestions;

  const onChangeSimpleSuggestion = (slotName: string, slotValue: string | null) => {
    setConfigState(prevState => ({
      ...prevState,
      [slotName]: slotValue
    }));
  };

  const onChangeFilterSuggestion = (filterName: string, filterValue: string | null) => {
    setConfigState(prevState => ({
      ...prevState,
      filter: { ...prevState.filter, [filterName]: filterValue }
    }));
  };

  return (
    <Stack gap={4} orientation="vertical">
      {/* no translation because only English is possible as of now. */}
      <h1>Thanks, this information will be used for creating the widget:</h1>
      <span>
        It looks like you want to create a <strong>{lowerCase(widgetType)}</strong> widget
      </span>
      <Stack gap={2} orientation="vertical">
        <span>
          <strong>I could extract the following information:</strong>
        </span>
        <UnorderedList>
          {Object.entries(inferredConfig!)
            .filter(([_, slotValue]) => Boolean(slotValue))
            .map(([slotName, slotValue], index) =>
              typeof slotValue === 'string' ? (
                <SimpleListItem name={slotName} value={String(slotValue)} key={index} />
              ) : (
                <FilterListItem name={slotName} value={slotValue} key={index} />
              )
            )}
        </UnorderedList>
      </Stack>
      {Object.keys(suggestions).length > 0 && (
        <Stack gap={2} orientation="vertical">
          <span>
            <strong>Additional information is required for:</strong>
          </span>
          <UnorderedList>
            {Object.entries(suggestions).map(([slotName, slotValue]) =>
              isArray(slotValue) ? (
                <ListItem key={slotName}>{lowerCase(slotName)}</ListItem>
              ) : (
                <>
                  <ListItem key={slotName}>{lowerCase(slotName)}:</ListItem>
                  <UnorderedList key={`${slotName}-list`}>
                    {Object.keys(slotValue!).map(filterName => (
                      <ListItem key={filterName}>{lowerCase(filterName)}</ListItem>
                    ))}
                  </UnorderedList>
                </>
              )
            )}
          </UnorderedList>
        </Stack>
      )}
      <Layer>
        {metric && (
          <SimpleSuggestionDropDown
            slotName={'metric'}
            onChangeSimpleSuggestion={onChangeSimpleSuggestion}
            suggestions={metric}
          />
        )}
        {aggregation && (
          <SimpleSuggestionDropDown
            slotName={'aggregation'}
            onChangeSimpleSuggestion={onChangeSimpleSuggestion}
            suggestions={aggregation}
          />
        )}
        {filter && <FilterSuggestions filter={filter} onChangeFilterSuggestion={onChangeFilterSuggestion} />}
      </Layer>
      {areAllSlotsFilled && (
        <WidgetPreviewWithSlots
          slots={{ widgetType, config: toInputConfig(configState) } as FinalConfig}
          onAddPromptedWidget={onAddPromptedWidget}
        />
      )}
    </Stack>
  );
};
