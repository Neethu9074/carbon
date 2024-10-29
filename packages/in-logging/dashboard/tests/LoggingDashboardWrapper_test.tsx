/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLoggingNavigationItems } from 'in-logging/dashboard/utils';

jest.mock('in-stores/navigation/hooks/useNavigation');
jest.mock('in-logging/dashboard/utils');
jest.mock('@instana/components', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => <button {...props}>{children}</button>,
  SecondLevelNavigation: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  SecondLevelNavigationItem: ({ label, href, isActive }: { label: string; href: string; isActive: boolean }) => (
    <a href={href} className={isActive ? 'active' : ''}>
      {label}
    </a>
  )
}));
jest.mock('in-components/DashboardHeader', () => ({
  __esModule: true,
  default: ({ renderButtonLine }: { renderButtonLine?: () => JSX.Element }) => (
    <div>
      DashboardHeader
      {renderButtonLine && renderButtonLine()}
    </div>
  )
}));
jest.mock('in-components/DashboardHeader/DashboardHeaderModule', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
jest.mock('in-components/DashboardHeader/DashboardHeaderShadowModule', () => ({
  __esModule: true,
  default: () => <div>DashboardHeaderShadowModule</div>
}));
jest.mock('in-logging/navigation/LoggingPermissionWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));
jest.mock('@instana/i18n-react', () => ({
  t: (key: string) => key
}));

describe('LoggingDashboardWrapper', () => {
  const mockUseNavigation = useNavigation as jest.Mock;
  const mockUseLoggingNavigationItems = useLoggingNavigationItems as jest.Mock;

  beforeEach(() => {
    mockUseNavigation.mockReturnValue({
      location: { pathname: '/logging' },
      createHref: jest.fn(),
      matchLocation: jest.fn(),
      createHrefToPath: jest.fn().mockReturnValue('/logging') // Mock return value
    });

    mockUseLoggingNavigationItems.mockReturnValue([
      {
        path: '/logging',
        label: 'Summary',
        currentTab: (path: string) => path === '/logging',
        isTabAllowed: true
      },
      {
        path: '/logging/alerts',
        label: 'Smart alerts',
        currentTab: '/logging/alerts',
        isTabAllowed: true
      }
    ]);
  });

  it('should render DashboardHeader and SecondLevelNavigation', () => {
    render(
      <LoggingDashboardWrapper withPadding>
        <div>Test Content</div>
      </LoggingDashboardWrapper>
    );

    expect(screen.getByText('DashboardHeaderShadowModule')).toBeInTheDocument();

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Smart alerts')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render ButtonLine with analyze logs button', () => {
    render(
      <LoggingDashboardWrapper>
        <div>Test Content</div>
      </LoggingDashboardWrapper>
    );

    expect(screen.getByRole('button', { name: 'in-logging:dashboard.analyzeLogs' })).toBeInTheDocument();
  });

  it('should match location with currentTab in SecondLevelNavigationItem', () => {
    const pathname = '/logging';
    mockUseNavigation.mockReturnValue({
      location: { pathname },
      createHref: jest.fn(),
      matchLocation: jest.fn(currentTab => {
        if (typeof currentTab === 'function') {
          return currentTab(pathname);
        } else {
          return currentTab === pathname;
        }
      }),
      createHrefToPath: jest.fn().mockReturnValue('/logging')
    });

    render(
      <LoggingDashboardWrapper>
        <div>Test Content</div>
      </LoggingDashboardWrapper>
    );

    expect(screen.getByText('Summary'));
  });
});
