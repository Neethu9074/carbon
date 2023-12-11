/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { Spacer, Stack } from '@instana/components';
import { Link } from '@instana/components';

import {
  updateCustomEventActionAssociations,
  updateBuiltinEventActionAssociations,
  ScoredAction
} from 'in-automation/api';
import { descriptionColumn, tagsColumn, typeColumn } from 'in-automation/ActionCatalog/ActionTable';
import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import ComboBox, { hasMultipleValuesSelected } from 'in-components/ComboBox/ComboBox';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import usePaginatedResult from 'in-automation/Policies/usePaginatedResult';
import { Action, ApplicationAlertConfigWithMetadata } from 'in-types';
import { usePagination } from 'in-automation/Policies/usePagination';
import { associateActionsTracker } from 'in-automation/tracker';
import { isExternal } from 'in-automation/ActionCatalog/shared';
import IconButton from 'in-components/IconButton/IconButton';
import { EventSpecification } from 'in-automation/api';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { success } from 'in-services/util/result';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './RecommendationctionsTable.mless';

interface RecommendedActionsCardAlertsProps {
  unusedSuggestedActions: ScoredAction[];
  existingActions: Action[];
  eventSpecification: EventSpecification | ApplicationAlertConfigWithMetadata;
  triggerReload: () => void;
  isCustomEvent: boolean;
  setError: (e: boolean) => void;
  setSelectedType: (str: string) => void;
}

export default function RecommendationctionsTable({
  unusedSuggestedActions,
  existingActions,
  eventSpecification,
  triggerReload,
  setError,
  isCustomEvent,
  setSelectedType
}: RecommendedActionsCardAlertsProps) {
  const [{ page, pageSize, orderBy, orderDirection, query }, setServerTableState] = usePagination('score', 'DESC');
  const { filteredActions, types, setTypes, aiEngines, setAiEngines } = useFilters(
    unusedSuggestedActions,
    setServerTableState
  );

  const actionAIEngines: string[] = [...new Set(unusedSuggestedActions.flatMap(action => action.aiEngine ?? []))];
  const result = usePaginatedResult(success(filteredActions), { page, pageSize, orderBy, orderDirection, query }, [
    'name',
    'description',
    'type',
    action => action?.tags?.toString() ?? ''
  ]);

  return (
    <div>
      <Spacer vertical="normal" />
      <Title title={t('in-automation:recommendedActions')} />
      <ServerTablePresenter
        onChange={setServerTableState}
        page={page}
        pageSize={7}
        result={result}
        searchPlaceholder={t('in-automation:searchActions')}
        query={query}
        rightHeader={
          <ActionFilters
            types={types}
            actionAIEngines={actionAIEngines}
            setTypes={setTypes}
            aiEngines={aiEngines}
            setAIEngines={setAiEngines}
          />
        }
        columnDefinitions={[
          nameColumn,
          descriptionColumn,
          typeColumn,
          tagsColumn,
          aiEngineColumn,
          scoreColumn,
          {
            id: 'selectAction',
            label: '',
            sortable: false,
            width: '10',
            widthInAbsoluteUnit: true,
            getContent: (item: Action) =>
              !isExternal(item.type) ? (
                <Tooltip content={t('in-automation:associateActionWithName', { actionName: item.name })} delay={500}>
                  <IconButton
                    kind="primaryv2"
                    type={'lib_openclose_add_circle_outline'}
                    onClick={e => {
                      stopPropagationAndPreventDefault(e);
                      associateAction({
                        action: item,
                        existingActions,
                        event: eventSpecification,
                        triggerReload,
                        setError,
                        isCustomEvent,
                        setSelectedType
                      });
                    }}
                  />
                </Tooltip>
              ) : (
                <div />
              )
          }
        ]}
        orderBy={orderBy}
        orderDirection={orderDirection}
      />
    </div>
  );
}

const options = [
  { value: 'doc_link', label: t('in-automation:ActionCatalog.docLink') },
  { value: 'SCRIPT', label: t('in-automation:ActionCatalog.script') },
  { value: 'HTTP', label: t('in-automation:ActionCatalog.http') },
  { value: 'MANUAL', label: t('in-automation:ActionCatalog.manual') },
  { value: 'ANSIBLE', label: t('in-automation:ActionCatalog.ansible') },
  { value: 'EXTERNAL', label: t('in-automation:actionHistory.external') }
];

function ActionFilters({
  types,
  actionAIEngines,
  aiEngines,
  setAIEngines,
  setTypes
}: {
  types: string[];
  actionAIEngines: string[];
  aiEngines: string[];
  setAIEngines: React.Dispatch<React.SetStateAction<string[]>>;
  setTypes: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <>
      <Stack direction="horizontal">
        <ComboBox
          options={options}
          placeholder={t('in-automation:type')}
          value={types}
          onChange={newValue => {
            if (!newValue) {
              setTypes([]);
            } else if (hasMultipleValuesSelected(newValue)) {
              setTypes(newValue.map(o => o.value));
            } else {
              setTypes([newValue.value]);
            }
          }}
        />
        <ComboBox
          options={actionAIEngines.map(tag => ({ value: tag, label: tag }))}
          placeholder="Engine"
          value={aiEngines}
          onChange={newValue => {
            if (!newValue) {
              setAIEngines([]);
            } else if (hasMultipleValuesSelected(newValue)) {
              setAIEngines(newValue.map(o => o.value));
            } else {
              setAIEngines([newValue.value]);
            }
          }}
        />
      </Stack>
      <Spacer horizontal="small" />
    </>
  );
}

interface AssociateActionProps {
  action: Action;
  existingActions: Action[];
  event: EventSpecification | ApplicationAlertConfigWithMetadata;
  triggerReload: () => void;
  setError: (e: boolean) => void;
  isCustomEvent: boolean;
  setSelectedType: (str: string) => void;
}

function associateAction({
  action,
  event,
  triggerReload,
  setError,
  isCustomEvent,
  existingActions,
  setSelectedType
}: AssociateActionProps) {
  associateActionsTracker({
    eventName: event.name,
    actionNames: [action.name]
  });

  const onSave = () => {
    triggerReload();
    setSelectedType('associatedActions');
  };
  const handleErrors = () => setError(true);
  const updatedActions = [...existingActions, action];

  const updateActionAssociations = isCustomEvent
    ? updateCustomEventActionAssociations
    : updateBuiltinEventActionAssociations;

  updateActionAssociations(
    updatedActions.map(({ id }) => id),
    event.id
  ).once(onSave, handleErrors);
}

function useFilters(
  actions: ScoredAction[],
  setServerTableState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void
) {
  const [types, setTypes] = useState<string[]>([]);
  const [aiEngines, setAiEngines] = useState<string[]>([]);

  const filters = [
    {
      key: 'type' as const,
      value: types
    },
    {
      key: 'aiEngine' as const,
      value: aiEngines
    }
  ];
  const filteredActions = actions.filter(action => {
    let shouldInclude = true;
    filters.forEach(filter => {
      const nonEmptyFilter = filter.value.length > 0;
      if (filter.key === 'type' && nonEmptyFilter) {
        shouldInclude = shouldInclude && filter.value.includes(action.type);
      } else if (filter.key === 'aiEngine' && nonEmptyFilter) {
        shouldInclude = shouldInclude && filter.value.includes(action.aiEngine);
      }
    });
    return shouldInclude;
  });
  return {
    filteredActions,
    types,
    setTypes: (types: React.SetStateAction<string[]>) => {
      setTypes(types);
      setServerTableState({ page: 1, query: '' });
    },
    aiEngines,
    setAiEngines: (aiEngines: React.SetStateAction<string[]>) => {
      setAiEngines(aiEngines);
      setServerTableState({ page: 1, query: '' });
    }
  };
}
const scoreColumn = {
  label: t('in-automation:ActionCatalog.aiScore'),
  id: 'confidence',
  width: '5',
  getContent: (row: ScoredAction) =>
    !isExternal(row.type) ? (
      <Tooltip
        content={t('in-automation:ActionCatalog.confidenceHelpText', { source: row.aiEngine })}
        align="topRight"
        delay={500}
      >
        <span className={locals.cursorPointer}>
          {t('in-automation:ActionCatalog.confidence', { context: row.confidence })}
        </span>
      </Tooltip>
    ) : (
      <div />
    ),
  getValue: (row: ScoredAction) => {
    return row.score;
  }
};

const nameColumn = {
  label: t('in-automation:name'),
  id: 'name',
  width: '20',
  ellipsis: true,
  getContent(row: Action) {
    const description = row?.description ?? row.name;
    return (
      <Tooltip content={row.name} delay={500}>
        {isExternal(row.type) ? (
          <Link ellipsis href={row.name} external>
            <span
              className={classNames({
                [locals.block]: true,
                [locals.ellipsis]: description.length > 60
              })}
            >
              {description}
            </span>
          </Link>
        ) : (
          <span
            className={classNames({
              [locals.block]: true,
              [locals.ellipsis]: description.length > 60
            })}
          >
            {row.name}
          </span>
        )}
      </Tooltip>
    );
  }
};

const aiEngineColumn = {
  label: t('in-automation:aiEngine'),
  id: 'engine',
  width: '5',
  getContent(row: ScoredAction) {
    return (
      <span className={locals.cursorPointer}>
        {row.aiEngine.startsWith('A similar event') ? t('in-automation:eventSimilarity') : row.aiEngine}
      </span>
    );
  }
};
