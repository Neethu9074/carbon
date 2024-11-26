/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback } from 'react';
import { isArray, isEqual } from 'lodash';

import { KeyValue, Pill, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { t } from '@instana/i18n-react';

import { buildJsonParser, buildJsonSerializer, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { sourceOptions } from 'in-internal/thisUnit/TagProcessor/sources';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import memoize from 'in-services/util/memoizingObservableGenerator';
import ComboBox, { Option } from 'in-components/ComboBox/ComboBox';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import Input from 'in-components/form/Input/Input';
import { success } from 'in-services/util/result';
import useUrlState from 'in-hooks/useUrlState';
import http from 'in-services/http';

import locals from './TagProcessorState.mless';

export const path = '/tagProcessorState';

const taggedObjectIdParameter = {
  path,
  name: 'taggedObjectId',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(''),
  initialState: ''
};

const sourceParameter = {
  path,
  name: 'source',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(''),
  initialState: 'snapshot'
};

export default function TagProcessorState() {
  const [state, setState] = useUrlState<{ taggedObjectId: string; source: string }>({
    bind: [taggedObjectIdParameter, sourceParameter]
  });

  const taggedObjectId = useDebouncedValue(state.taggedObjectId, taggedObjectId => setState({ taggedObjectId }));

  const stateResult = useState(state);

  return (
    <div className={locals.view}>
      <div className={locals.inputs}>
        <Input
          type="text"
          id="snapshotId-value"
          placeholder={t('in-internal:thisUnit.tagProcessor.enterTaggedObjectId')}
          value={taggedObjectId.value}
          onChange={e => taggedObjectId.onChange(e.target.value)}
          autoFocus
        />
        <ComboBox
          options={sourceOptions}
          value={state.source}
          onChange={e => setState({ source: (e && (e as Option))?.value })}
        />
      </div>
      {stateResult.data && <StatePresenter state={stateResult.data} />}
    </div>
  );
}

function useState(state: { taggedObjectId: string; source: string }) {
  return (
    useObservable(
      () => (state.taggedObjectId && state.source ? getState(state) : just(success(null))),
      [state.taggedObjectId, state.source]
    ) ?? pendingResult
  );
}

function StatePresenter({ state }: { state: State }) {
  const selfTags = getSelfTags(state);
  const otherTags = state.tagsWithSources.filter(tws => !isEqual(tws.source, state.key));

  return (
    <Stack>
      <div className={locals.header}>
        <div className={locals.title}>{state.key.taggedObjectId}</div>
        <Source source={state.key.source} />
        <TagSetGenerating tagSetGenerating={state.tagSetGenerating} />
        <Type type={getType(state)} />
      </div>
      {selfTags && <Tags tags={selfTags} stateKey={state.key} />}
      {otherTags.map(tags => (
        <Tags key={tags.source.id} tags={tags} stateKey={state.key} />
      ))}
      <div className={locals.dependencies}>
        <Edges title={t('in-internal:thisUnit.tagProcessor.sources')} edges={state.sources} />
        <Edges title={t('in-internal:thisUnit.tagProcessor.destinations')} edges={state.destinations} />
      </div>
    </Stack>
  );
}

function Source({ source }: { source: string }) {
  if (source === 'snapshot') {
    return <Pill type="orange">{t('in-internal:thisUnit.tagProcessor.snapshot')}</Pill>;
  } else if (source === 'tagged_metric') {
    return <Pill type="green">{t('in-internal:thisUnit.tagProcessor.taggedMetric')}</Pill>;
  } else if (source === 'chain') {
    return <Pill type="blue">{t('in-internal:thisUnit.tagProcessor.chain')}</Pill>;
  } else {
    return <Pill type="red">{source}</Pill>;
  }
}

function TagSetGenerating({ tagSetGenerating }: { tagSetGenerating: boolean }) {
  if (tagSetGenerating) {
    return <Pill type="cyan">{t('in-internal:thisUnit.tagProcessor.tagSetGenerating')}</Pill>;
  } else {
    return <Pill type="lime">{t('in-internal:thisUnit.tagProcessor.dependency')}</Pill>;
  }
}

function Type({ type }: { type?: string }) {
  if (type) {
    return <Pill type="magenta">{type}</Pill>;
  } else {
    return null;
  }
}

function Tags({ tags, stateKey }: { tags: TagsWithSource; stateKey: Key }) {
  return (
    <div className={locals.tagsWithSource}>
      <div className={locals.key}>
        {isEqual(stateKey, tags.source) ? (
          t('in-internal:thisUnit.tagProcessor.selfTags')
        ) : (
          <>
            {t('in-internal:thisUnit.tagProcessor.tagsInheritedFrom')}
            <Link taggedObjectId={tags.source.taggedObjectId} source={tags.source.source} />
            <Source source={tags.source.source} />
          </>
        )}
      </div>
      <div className={locals.tags}>
        {tags.tags.map(tag => (
          <KeyValue key={tag.key} label={tag.key} value={<TagValue tag={tag} />} />
        ))}
      </div>
    </div>
  );
}

function TagValue({ tag }: { tag: Tag }) {
  const value = tag.stringValue ?? tag.idValue ?? tag.doubleValue ?? tag.longValue;
  if (isArray(value)) {
    const more = value.length > 10 && t('in-internal:thisUnit.tagProcessor.more', { more: value.length - 10 });
    return (
      <>
        {value.slice(0, 10).map((v, i) => (
          <div key={i}>{v}</div>
        ))}
        {more}
      </>
    );
  } else {
    return <div>{value}</div>;
  }
}

function Edges({ title, edges }: { title: string; edges: Edge[] }) {
  if (edges.length === 0) {
    return null;
  }

  return (
    <div className={locals.edges}>
      <div className={locals.edgesTitle}>{title}</div>
      {edges.map(edge => (
        <EdgePresenter key={edge.tid} {...edge} />
      ))}
    </div>
  );
}

function EdgePresenter({ tid, s }: Edge) {
  return (
    <div className={locals.edge}>
      <Link taggedObjectId={tid} source={s ?? 'snapshot'} />
    </div>
  );
}

function Link({ taggedObjectId, source }: { taggedObjectId: string; source: string }) {
  const createLink = useLinkToState();

  const stateResult = useState({ taggedObjectId, source });

  const label = getLabel(stateResult?.data);
  const type = getType(stateResult?.data);
  const tagCount = countTags(stateResult?.data);
  const metricId = getMetricNameWithTags(stateResult?.data);
  const connectionCount = countConnections(stateResult?.data);

  const infoText = t('in-internal:thisUnit.tagProcessor.info', { tagCount, connectionCount });

  return (
    <a href={createLink({ taggedObjectId, source })}>
      {label ?? metricId ?? taggedObjectId + ' (' + infoText + ')'}
      {type && ' (' + type + ')'}
    </a>
  );
}

function getType(state?: State) {
  return getSelfTag(state, 'type')?.stringValue as string | undefined;
}

function getLabel(state?: State) {
  return getSelfTag(state, 'label')?.stringValue as string | undefined;
}

function getMetricNameWithTags(state?: State) {
  return getSelfTag(state, 'metricNameWithTags')?.stringValue as string | undefined;
}

function getSelfTag(state?: State, tag?: string) {
  return getTag(getSelfTags(state)?.tags, tag);
}

function getSelfTags(state?: State) {
  return state?.tagsWithSources.find(tws => isEqual(tws.source, state.key));
}

function getTag(tags?: Tag[], key?: string) {
  return tags?.find(tag => tag.key === key);
}

function countTags(state?: State) {
  return state?.tagsWithSources?.flatMap(tws => tws.tags).length;
}

function countConnections(state?: State) {
  const destinations = state?.destinations?.length ?? 0;
  const edgeSources = state?.sources?.length ?? 0;
  const tagSources = state?.tagsWithSources.length ?? 0;
  const sources = edgeSources + tagSources;
  return destinations + sources;
}

function useLinkToState() {
  const pathname = '/internal/thisUnit/tagProcessorState';
  const { createHref, location } = useNavigation();

  return useCallback(
    ({ taggedObjectId, source }: { taggedObjectId: string; source: string }) => {
      const clonedLocation = cloneLocation(location);
      clonedLocation.pathname = pathname;

      setOrDeleteMatrixParameter(clonedLocation, taggedObjectIdParameter, taggedObjectId);
      setOrDeleteMatrixParameter(clonedLocation, sourceParameter, source);

      return createHref(clonedLocation);
    },
    [createHref, location]
  );
}

interface Key {
  clientId: string;
  taggedObjectId: string;
  source: string;
  id: string;
}

interface Tag {
  key: string;
  stringValue?: string | string[];
  longValue?: number | number[];
  doubleValue?: number | number[];
  idValue?: string | string[];
  metadata?: any;
}

interface TagsWithSource {
  source: Key;
  tags: Tag[];
}

interface Edge {
  tid: string;
  s?: string;
}

interface State {
  key: Key;
  timestamp: number;
  tagSetGenerating: boolean;
  tagsWithSources: TagsWithSource[];
  expirationMs?: number;
  sources: Edge[];
  destinations: Edge[];
}

const getState = memoize(getStateRaw, arg => JSON.stringify(arg), 10000);

function getStateRaw({ taggedObjectId, source }: { taggedObjectId: string; source: string }) {
  return http<State | null>({
    method: 'GET',
    url: '/api/tag-processor/state',
    mapToResultObject: true,
    maxRetries: 3,
    queryParams: {
      taggedObjectId,
      source
    }
  });
}
