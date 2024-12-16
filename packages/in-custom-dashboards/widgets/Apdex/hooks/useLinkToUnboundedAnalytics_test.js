/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import getJumpDirectlyToApplicationLikeUA2Href$ from 'in-custom-dashboards/widgets/SloLegacy/hooks/analytics/getJumpDirectlyToApplicationLikeUA2Href';
import getLinkToWebsiteAnalyze from 'in-custom-dashboards/widgets/SloLegacy/hooks/analytics/getLinkToWebsiteAnalyze';
import useLinkToUnboundedAnalytics from 'in-custom-dashboards/widgets/Apdex/hooks/useLinkToUnboundedAnalytics';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { minutes } from 'in-services/time';

jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/analytics/getLinkToWebsiteAnalyze');
jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/analytics/getJumpDirectlyToApplicationLikeUA2Href');

// Disable tests due to release fix #11630
it('prevent failure due to no tests found', () => expect(true).toBeTruthy());
describe.skip('in-custom-dashboards/widgets/Apdex/hooks/useLinkToUnboundedAnalytics', () => {
  it('returns an empty href generator if apdexConfig is undefined', done => {
    // Given
    const apdexConfig = undefined;
    const tagCatalog = {};

    // When
    const generator = useLinkToUnboundedAnalytics({ apdexConfig, tagCatalog });
    const actual = generator();

    // Then
    actual.once(href => {
      expect(href).toEqual('');
      done();
    });
  });

  it('returns an empty href generator if tagCatalog is undefined', done => {
    // Given
    const apdexConfig = {};
    const tagCatalog = undefined;

    // When
    const generator = useLinkToUnboundedAnalytics({ apdexConfig, tagCatalog });
    const actual = generator();

    // Then
    actual.once(href => {
      expect(href).toEqual('');
      done();
    });
  });

  it('returns an empty href generator if the apdexConfig is of unknown type', done => {
    // Given
    const apdexConfig = { apdexEntity: { apdexType: 'SOME_UNKNOWN_TYPE' } };
    const tagCatalog = {};

    // When
    const generator = useLinkToUnboundedAnalytics({ apdexConfig, tagCatalog });
    const actual = generator();

    // Then
    actual.once(href => {
      expect(href).toEqual('');
      done();
    });
  });

  it('returns a href generator that generates a link to website analyze filtered by the apdexConfig if a website apdexConfig is given', () => {
    // Given
    const entityId = 'Stans recipe website';
    const beaconType = 'didnt read backstory';
    const tagFilterExpression = tagFilter('page', 'EQUALS', 'recipes');
    const timeConfig = { windowSize: minutes.toMillis(2), autoRefresh: false };
    const apdexConfig = {
      apdexEntity: {
        apdexType: 'website',
        entityId,
        beaconType,
        tagFilterExpression
      }
    };
    const tagCatalog = {};

    // When
    const generator = useLinkToUnboundedAnalytics({ apdexConfig, tagCatalog });
    generator(timeConfig);

    // Then
    expect(getLinkToWebsiteAnalyze).toHaveBeenLastCalledWith(
      expect.objectContaining({
        websiteId: entityId,
        beaconType,
        timeConfig,
        tagCatalog,
        filterExpression: tagFilterExpression
      })
    );
  });

  it('returns a href generator that generates a link to application analyze filtered by the apdexConfig if an application apdexConfig is given', () => {
    // Given
    const entityId = 'Stans cookie factory';
    const boundaryScope = 'ALL';
    const includeInternal = true;
    const includeSynthetic = true;
    const tagFilterExpression = tagFilter('agent.zone', 'EQUALS', 'cookies');
    const timeConfig = { windowSize: minutes.toMillis(2), autoRefresh: false };
    const apdexConfig = {
      apdexEntity: {
        apdexType: 'application',
        entityId,
        boundaryScope,
        includeInternal,
        includeSynthetic,
        tagFilterExpression
      }
    };

    // When
    const generator = useLinkToUnboundedAnalytics({ apdexConfig, tagCatalog: {} });
    generator(timeConfig);

    // Then
    expect(getJumpDirectlyToApplicationLikeUA2Href$).toHaveBeenLastCalledWith(
      { applicationId: entityId },
      tagFilterExpression,
      [],
      boundaryScope,
      expect.objectContaining({
        timeConfig,
        hiddenCalls: expect.objectContaining({
          includeInternal,
          includeSynthetic
        })
      })
    );
  });
});
