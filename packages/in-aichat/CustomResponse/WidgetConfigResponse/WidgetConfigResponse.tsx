/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */
import React, { useCallback } from 'react';
import { GenericItem } from '@carbon/ai-chat';
import { lowerCase } from 'lodash';

import { Dropdown, ListItem, UnorderedList } from '@instana/carbon';
import { useObservable } from '@instana/hooks';

import {
  CommonPossibleConfig,
  CommonInferredConfig,
  InferredSlotConfig,
  PossibleSlotConfig,
  SLOPossibleConfig,
  SLOInferredConfig
} from 'in-aichat/CustomResponse/WidgetConfigResponse/types';
import { CommonConfigResponse } from 'in-aichat/CustomResponse/WidgetConfigResponse/components/CommonConfigResponse';
import { SloConfigResponse } from 'in-aichat/CustomResponse/WidgetConfigResponse/components/SloConfigResponse';
// import { Widget } from '@instana/types';
import { deepCopy } from 'in-services/util/object';
import { customDashboardConfig$, setCustomDashboardConfig } from 'in-stores/customDashboard';

// Define the specific user_defined type for ConfigResponse
type ConfigResponseUserDefined = {
  user_defined_type: string;
  inferredSlotConfig: InferredSlotConfig;
  possibleSlotConfig?: PossibleSlotConfig;
};

interface Props {
  messageItem: GenericItem<ConfigResponseUserDefined>;
}

// ! we are currently assuming that there definitely will be a final slots and a possible slots object. This can change in the future.
export const ConfigResponse = ({ messageItem }: Props) => {
  const config = useObservable(customDashboardConfig$, [customDashboardConfig$])?.config || false;

  // Always define the callback hook, regardless of conditions
  // so that hook rendering stays consistent
  const onAddPromptedWidget = useCallback(
    widget => {
      if (!config) return;
      const newConfig = deepCopy(config);
      // @ts-expect-error - No type definitions available
      newConfig.widgets.push(widget);
      setCustomDashboardConfig(newConfig);
    },
    [config]
  );

  // Ensure user_defined exists before accessing its properties
  if (!messageItem.user_defined || !config) {
    return null; // Return early if user_defined is undefined or no config
  }

  const inferredSlotConfig = messageItem.user_defined.inferredSlotConfig;
  const possibleSlotConfig = messageItem.user_defined.possibleSlotConfig;

  const { widgetType: inferredWidgetType, config: inferredConfig } = inferredSlotConfig;

  return inferredWidgetType === 'slo2' ? (
    <SloConfigResponse
      inferredConfig={inferredConfig as SLOInferredConfig}
      possibleConfig={(possibleSlotConfig?.config as SLOPossibleConfig) ?? null}
      onAddPromptedWidget={onAddPromptedWidget}
    />
  ) : (
    <CommonConfigResponse
      widgetType={inferredWidgetType!}
      inferredConfig={inferredConfig as CommonInferredConfig}
      possibleConfig={(possibleSlotConfig?.config as CommonPossibleConfig) ?? null}
      onAddPromptedWidget={onAddPromptedWidget}
    />
  );
};

export function SimpleListItem({ name, value }: { name: string; value: string }): JSX.Element {
  return (
    <ListItem key={name}>
      {lowerCase(name)}: <strong>{value}</strong>
    </ListItem>
  );
}

export function FilterListItem({ name, value }: { name: string; value: Record<string, any> | null }): JSX.Element {
  return (
    <>
      <ListItem key={name}>{lowerCase(name)}:</ListItem>
      <UnorderedList key={`${name}-extractions`}>
        {Object.entries(value!)
          .filter(([_, val]) => Boolean(val))
          .map(([filterName, filterValue]) => (
            <SimpleListItem name={filterName} value={String(filterValue)} key={filterName} />
          ))}
      </UnorderedList>
    </>
  );
}

export function FilterSuggestions({
  filter,
  onChangeFilterSuggestion
}: {
  filter: Record<string, string[]>;
  onChangeFilterSuggestion: (filterName: string, filterValue: string | null) => void;
}) {
  return (
    <>
      {Object.entries(filter).map(([filterName, candidates]) => {
        return (
          <SimpleSuggestionDropDown
            slotName={filterName}
            suggestions={candidates}
            onChangeSimpleSuggestion={onChangeFilterSuggestion}
            key={filterName}
          />
        );
      })}
    </>
  );
}

export function SimpleSuggestionDropDown({
  slotName,
  suggestions,
  onChangeSimpleSuggestion
}: {
  slotName: string;
  suggestions: string[];
  onChangeSimpleSuggestion: (slotName: string, slotValue: string | null) => void;
}) {
  if (!suggestions) {
    return null;
  }

  const readableSlotName = lowerCase(slotName);

  return (
    <Dropdown
      id={`select ${readableSlotName}`}
      titleText={`select ${readableSlotName}`}
      label={`select ${readableSlotName}`}
      direction="top"
      items={suggestions}
      onChange={data => {
        onChangeSimpleSuggestion(slotName, data.selectedItem);
      }}
    />
  );
}
