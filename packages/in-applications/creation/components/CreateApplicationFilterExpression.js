/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Li, Button } from '@instana/components';

import ContributionFilterDropdown, {
  showContributionFilterDropdown
} from 'in-applications/creation/components/ContributionFilterDropdown';
import TagFilterExpressionConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagFilterExpressionConfigurationWrapper';
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import { findByRestrictingApplicationId } from 'in-applications/creation/contributionFilters';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import TagSelectorOverlay from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import QuickFilterBar from 'in-applications/creation/components/QuickFilterBar';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './CreateApplicationFilterExpression.mless';

export default function CreateApplicationFilterExpression({
  form,
  selectedBlueprint,
  timeConfig,
  updateForm,
  blueprintCatalogResult,
  userRestrictedApplications
}) {
  const categories = blueprintCatalogResult.data?.tagTree.find(
    category => category.label === selectedBlueprint.type
  ).children;

  const tagFilterExpressionField = form.get('tagFilterExpression');
  const restrictingApplicationId = form.get('restrictingApplicationId').value;
  const contributionFilter = findByRestrictingApplicationId(userRestrictedApplications, restrictingApplicationId)
    ?.filter?.tagFilterExpression;

  return (
    <TagFilterExpressionConfigurationWrapper
      quickFilterBar={
        blueprintCatalogResult.data && (
          <QuickFilterBar
            curatedTagFilters={categories.map(category => (
              <Overlay
                key={category.label}
                content={TagSelectorOverlay}
                props={{
                  tagCatalog: {
                    tagTree: category.children
                  },
                  onChange: tag => addTagFilter(tag, tagFilterExpressionField.value, form, updateForm)
                }}
                align="bottomLeft"
                withoutWrapper
              >
                {({ toggle, isOpen, refSetter }) => (
                  <BarItem
                    timeConfig={timeConfig}
                    showArrow={category.children.length > 1}
                    onClick={
                      category.children.length === 1
                        ? () =>
                            addTagFilter(
                              { name: category.children[0].tagName },
                              tagFilterExpressionField.value,
                              form,
                              updateForm
                            )
                        : toggle
                    }
                    refSetter={refSetter}
                    active={isOpen}
                    isOpen={isOpen}
                  >
                    {category.label}
                  </BarItem>
                )}
              </Overlay>
            ))}
            hideClearFiltersButton
            withoutFiltersLabel
          />
        )
      }
      queryBuilder={
        <>
          {showContributionFilterDropdown(userRestrictedApplications) && (
            <div className={locals.contributionFilter}>
              <ContributionFilterDropdown
                userRestrictedApplications={userRestrictedApplications}
                form={form}
                updateForm={updateForm}
                className={locals.listItem}
              />
            </div>
          )}
          <Li component="div" noAlternatingBg>
            <div className={locals.queryBuilder}>
              <div className={locals.queryBuilderExpression}>
                <CreateApplicationQueryBuilder
                  value={tagFilterExpressionField.value}
                  getSuggestionsProps={{ contributionFilter }}
                  onChange={tagFilterExpression => setTagFilterExpression(tagFilterExpression, form, updateForm)}
                  autoFocusInput
                />
              </div>

              <HorizontalFlexWrapper>
                {tagFilterExpressionField.value.length > 0 && (
                  <Button
                    kind="subtle"
                    icon="lib_openclose_cancel"
                    size="compact"
                    onClick={() => setTagFilterExpression([], form, updateForm)}
                  >
                    {t('in-applications:buttonClear')}
                  </Button>
                )}
              </HorizontalFlexWrapper>
            </div>
          </Li>
        </>
      }
    />
  );
}

function addTagFilter({ name }, tagFilterExpression, form, updateForm) {
  const addedTag = {
    type: 'TAG_FILTER',
    name,
    operator: 'EQUALS'
  };
  setTagFilterExpression(
    joinExpressions({
      expressions: [tagFilterExpression, addedTag]
    }),
    form,
    updateForm
  );
}

function setTagFilterExpression(tagFilterExpression, form, updateForm) {
  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression)));
}
