/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode, useEffect, useState } from 'react';

import { Message, Stack, Button, PreviewPill } from '@instana/components';
import { TagCatalog } from '@instana/types';

import {
  GetSuggestionLabel,
  GetSuggestionsProps,
  QueryBuilderComponent,
  QueryBuilderTrackingFunctions
} from 'in-components/QueryBuilder';
import SectionLabelWithSubtext from 'in-components/workspace/SectionLabelWithSubtext/SectionLabelWithSubtext';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { emptyObject } from 'in-services/fixedObjects';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

export const DEFAULT_MAX_EXPRESSION_DEPTH = 5;

interface QueryBuilderSectionProps<ADDITIONAL_TAG_CATALOG_PROPS = {}> {
  value: FormModelElement[];
  QueryBuilder: QueryBuilderComponent<{}, ADDITIONAL_TAG_CATALOG_PROPS>;
  getSuggestionsProps?: GetSuggestionsProps;
  getSuggestionLabel?: GetSuggestionLabel;
  additionalGetTagCatalogProps?: ADDITIONAL_TAG_CATALOG_PROPS;
  onChange: (formModel: FormModelElement[]) => void;
  tracking?: QueryBuilderTrackingFunctions;
  tagCatalog?: TagCatalog;
  fixOverlayLeftAlignment?: boolean;
  useLastValidStateWhenErroneous?: boolean;
  source?: string;

  withOptionalMarker?: boolean;
  withTechnicalPreview?: boolean;

  hasError?: boolean;
  errors?: string[];

  actions?: ReactNode;
  withoutIcon?: boolean;
  onErrorStateChange?: (hasError: boolean) => void;
  SectionWrapper?: React.FunctionComponent<any>;
}

export default function QueryBuilderSection<ADDITIONAL_TAG_CATALOG_PROPS = {}>({
  value: tagFilterExpression,
  QueryBuilder,
  onChange,
  tracking,
  withoutIcon,
  fixOverlayLeftAlignment = false,
  actions,
  useLastValidStateWhenErroneous = false,
  withOptionalMarker = false,
  withTechnicalPreview = false,
  hasError: hasExternalError,
  errors: externalErrors,
  tagCatalog,
  getSuggestionsProps = {},
  getSuggestionLabel,
  onErrorStateChange,
  additionalGetTagCatalogProps,
  SectionWrapper = Section,
  source
}: QueryBuilderSectionProps<ADDITIONAL_TAG_CATALOG_PROPS>) {
  const [{ hasError: hasInternalError, errors: internalErrors }, setInternalError] = useState<{
    hasError?: boolean;
    errors?: string[];
  }>(emptyObject);

  const [clearRequested, setClearRequested] = useState(false);

  useEffect(() => {
    if (clearRequested) {
      setClearRequested(false);
    }
  }, [clearRequested]);

  useEffect(() => {
    setInternalError(emptyObject);
  }, [tagFilterExpression]);

  useEffect(() => {
    if (onErrorStateChange) onErrorStateChange(!hasInternalError);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInternalError]);

  let title = <>{t('in-components:queryBuilder.workspaceTitleFilter')}</>;
  if (withOptionalMarker) {
    title = (
      <SectionLabelWithSubtext subtext={t('in-components:queryBuilder.optional')}>{title}</SectionLabelWithSubtext>
    );
  }
  if (withTechnicalPreview) {
    title = (
      <>
        {title}
        <PreviewPill privatePreview />
      </>
    );
  }
  return (
    <SectionWrapper
      icon={withoutIcon ? undefined : 'lib_actions_filter'}
      title={title}
      actions={
        <HorizontalFlexWrapper>
          {(tagFilterExpression.length > 0 || hasInternalError) && (
            <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={onClear}>
              {t('in-components:queryBuilder.workspaceButtonClear')}
            </Button>
          )}
          {actions}
        </HorizontalFlexWrapper>
      }
      hasError={hasExternalError || hasInternalError}
    >
      <Stack gap="xsmall">
        <div>
          <QueryBuilder
            // If the 'Clear' button was clicked, pass a new empty array instance, so that the query builder can
            // notice this change and reset its internal copy of the 'tagFilterExpression' ('currentFormModel').
            // This is needed, because the parent components can reuse the same 'tagFilterExpression' instance,
            // e.g. using the 'useStableObjectInstance' hook.
            value={clearRequested ? [] : tagFilterExpression}
            onChange={(tagFilterExpression: FormModelElement[]) => {
              // If the tag filter expression changes, reset the 'queryHasErrors' flag. In case that the updated
              // is invalid, the 'queryHasErrors' flag will be set again by the `onError` callback.
              setInternalError(emptyObject);
              onChange(tagFilterExpression);
            }}
            source={source}
            tagCatalog={tagCatalog}
            onError={setInternalError}
            tracking={tracking}
            fixOverlayLeftAlignment={fixOverlayLeftAlignment}
            useLastValidStateWhenErroneous={useLastValidStateWhenErroneous}
            getSuggestionsProps={getSuggestionsProps}
            getSuggestionLabel={getSuggestionLabel}
            additionalGetTagCatalogProps={additionalGetTagCatalogProps}
          />
        </div>
        {hasInternalError &&
          internalErrors?.map(error => <Message key={error} type="error" withIcon small title={error} />)}
        {hasExternalError &&
          externalErrors?.map(error => <Message key={error} type="error" withIcon small title={error} />)}
      </Stack>
    </SectionWrapper>
  );

  function onClear() {
    tracking?.onQueryCleared?.();
    setClearRequested(true);
    setInternalError(emptyObject);
    onChange([]);
  }
}
