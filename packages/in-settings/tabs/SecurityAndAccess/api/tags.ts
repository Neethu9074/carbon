/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create } from '@instana/observables';

import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const basePath = '/api/settings/tags';

const refreshSignal = create().emit(true);

export function refresh() {
  refreshSignal.emit(true);
}

/**
 * Model for a Tag until type from backend is available
 * @property id unique tag id
 * @property displayName name of the tag
 */
export interface ApiTeamTag {
  readonly id: string;
  readonly displayName: string;
}

function getTagsInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http<ApiTeamTag[]>({
        method: 'GET',
        maxRetries: 3,
        url: basePath
      })
    )
  );
}

const getTagsAsResultObservableMemoized = memoize(getTagsInternal, () => 'Tags', 60000);
export const getTagsAsResultObservable = () => getTagsAsResultObservableMemoized([]);
