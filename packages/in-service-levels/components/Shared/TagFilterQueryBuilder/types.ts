/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import type { UseApplicationQueryBuilderProps } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import type { UseWebsiteQueryBuilderProps } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import type { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

export const isApplicationTagFilter = (props: TagFilterQueryBuilderProps): props is ApplicationQueryProps => {
  return 'applicationId' in props;
};

export const isWebsiteTagFilterQueryBuilder = (props: TagFilterQueryBuilderProps): props is WebsiteQueryProps => {
  return 'websiteId' in props;
};

interface QueryProps {
  onChange?: (val: FormModelElement[]) => void;
  readOnly?: boolean;
  value: FormModelElement[];
}

export type WebsiteQueryProps = QueryProps & UseWebsiteQueryBuilderProps;

export type ApplicationQueryProps = QueryProps & UseApplicationQueryBuilderProps;

export type TagFilterQueryBuilderProps = WebsiteQueryProps | ApplicationQueryProps;
