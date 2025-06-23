/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { lowerCase } from 'lodash';
import React from 'react';

import { Dropdown, ListItem, UnorderedList } from '@instana/carbon';
import { Widget } from '@instana/types';

import {
  CommonPossibleConfig,
  CommonInferredConfig,
  InferredSlotConfig,
  PossibleSlotConfig,
  SLOPossibleConfig,
  SLOInferredConfig
} from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { CommonConfigMessage } from 'in-custom-dashboards/CustomDashboard/AiChat/Messages/CommonConfigMessage';
import { SloConfigMessage } from 'in-custom-dashboards/CustomDashboard/AiChat/Messages/SloConfigMessage';

interface Props {
  inferredSlotConfig: InferredSlotConfig;
  possibleSlotConfig?: PossibleSlotConfig | null;
  onAddPromptedWidget: (widget: Widget) => void;
}

// ! we are currently assuming that there definitely will be a final slots and a possible slots object. This can change in the future.
export const ConfigMessage = ({ inferredSlotConfig, possibleSlotConfig, onAddPromptedWidget }: Props) => {
  const { widgetType: inferredWidgetType, config: inferredConfig } = inferredSlotConfig;

  return inferredWidgetType === 'slo2' ? (
    <SloConfigMessage
      inferredConfig={inferredConfig as SLOInferredConfig}
      possibleConfig={(possibleSlotConfig?.config as SLOPossibleConfig) ?? null}
      onAddPromptedWidget={onAddPromptedWidget}
    />
  ) : (
    <CommonConfigMessage
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
            <SimpleListItem name={filterName} value={String(filterValue)} />
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
