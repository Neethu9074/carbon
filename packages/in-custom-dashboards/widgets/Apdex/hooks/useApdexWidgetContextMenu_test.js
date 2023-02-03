/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import useLinkToUnboundedAnalytics from 'in-custom-dashboards/widgets/Apdex/hooks/useLinkToUnboundedAnalytics';
import useApdexWidgetContextMenu from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexWidgetContextMenu';

jest.mock('in-custom-dashboards/widgets/Apdex/hooks/useLinkToUnboundedAnalytics');

describe('in-custom-dashboards/widgets/Apdex/hooks/useApdexWidgetContextMenu', () => {
  it('returns an empty object if the apdexConfig is undefined', () => {
    // Given
    const apdexConfig = undefined;
    const tagCatalog = {};

    // When
    const actual = useApdexWidgetContextMenu({ apdexConfig, tagCatalog });

    // Then
    expect(actual).toEqual({});
  });

  it('returns a partial chart configuration containing a context menu item linking to unbounded analytics for the given apdexConfig', () => {
    // Given
    const apdexConfig = { apdexName: 'Stans first apdex' };
    const tagCatalog = {};
    const getHref$ = jest.fn();
    useLinkToUnboundedAnalytics.mockReturnValueOnce(getHref$);

    // When
    const actual = useApdexWidgetContextMenu({ apdexConfig, tagCatalog });

    // Then
    expect(useLinkToUnboundedAnalytics).toHaveBeenLastCalledWith({ apdexConfig, tagCatalog });
    expect(actual).toEqual(
      expect.objectContaining({
        additionalContextMenuButtons: expect.arrayContaining([
          expect.objectContaining({
            getHref$
          })
        ])
      })
    );
  });
});
