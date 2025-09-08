/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Layer, ListItem, Stack, UnorderedList } from '@instana/carbon';
import { Widget } from '@instana/types';

import {
  SimpleListItem,
  SimpleSuggestionDropDown
} from 'in-custom-dashboards/CustomDashboard/AiChat/Messages/ConfigMessage';
import { FinalConfig, SLOPossibleConfig, SLOInferredConfig } from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { WidgetPreviewWithSlots } from 'in-custom-dashboards/CustomDashboard/AiChat/Messages/WidgetPreviewWithSlots';
import { useSloSuggestions } from 'in-custom-dashboards/CustomDashboard/AiChat/hooks/useSloSuggestions';

interface Props {
  inferredConfig: SLOInferredConfig;
  possibleConfig: SLOPossibleConfig | null;
  onAddPromptedWidget: (widget: Widget) => void;
}

export const SloConfigMessage = ({ inferredConfig, possibleConfig, onAddPromptedWidget }: Props) => {
  const [configState, setConfigState] = useState(inferredConfig);

  const anySlotsFilled = Boolean(configState.sloId || configState.name);
  const areAllSlotsFilled = Boolean(configState.sloId && configState.name);

  const suggestions = useSloSuggestions(inferredConfig, possibleConfig);

  return (
    <Stack gap={4} orientation="vertical">
      <h1>Thanks, this information will be used for creating the widget:</h1>
      <span>
        It looks like you want to create a <strong>SLO</strong> widget
      </span>
      {anySlotsFilled && (
        <Stack gap={2} orientation="vertical">
          <span>
            <strong>I could extract the following information:</strong>
          </span>
          <UnorderedList>
            <SimpleListItem name={'slo name'} value={String(inferredConfig.name)} />
          </UnorderedList>
        </Stack>
      )}
      {suggestions && (
        <>
          <Stack gap={2} orientation="vertical">
            <span>
              <strong>Additional information is required for:</strong>
            </span>
            <UnorderedList>
              <ListItem key="slo-name">name</ListItem>
            </UnorderedList>
          </Stack>
          <Layer>
            <SimpleSuggestionDropDown
              slotName={'name'}
              onChangeSimpleSuggestion={(_, name) => {
                const slo = suggestions.find(suggestion => suggestion.name === name);
                if (slo) {
                  setConfigState(prevState => ({
                    ...prevState,
                    sloId: slo.sloId,
                    name: slo.name
                  }));
                }
              }}
              suggestions={suggestions.map(({ name }) => name!)}
            />
          </Layer>
        </>
      )}
      {areAllSlotsFilled && (
        <WidgetPreviewWithSlots
          slots={{ widgetType: 'slo2', config: configState } as FinalConfig}
          onAddPromptedWidget={onAddPromptedWidget}
        />
      )}
    </Stack>
  );
};
