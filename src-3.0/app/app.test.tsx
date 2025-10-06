import * as React from 'react';
import App from '@app/index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('App tests', () => {
  beforeEach(() => {
    // Set up authentication for all tests
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'rhoai-auth') return 'authenticated';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render default App component', () => {
    const { asFragment } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render a nav-toggle button', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'Global navigation' })).toBeVisible();
  });

  // I'm fairly sure that this test not going to work properly no matter what we do since JSDOM doesn't actually
  // draw anything. We could potentially make something work, likely using a different test environment, but
  // using Cypress for this kind of test would be more efficient.
  it.skip('should hide the sidebar on smaller viewports', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 600 });

    render(<App />);

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.queryByRole('button', { name: 'Generative AI studio' })).not.toBeInTheDocument();
  });

  it('should expand the sidebar on larger viewports', async () => {
    render(<App />);

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.getByRole('button', { name: 'Generative AI studio' })).toBeVisible();
  });

  it('should hide the sidebar when clicking the nav-toggle button', async () => {
    const user = userEvent.setup();

    render(<App />);

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });
    const button = screen.getByRole('button', { name: 'Global navigation' });

    expect(screen.getByRole('button', { name: 'Generative AI studio' })).toBeVisible();

    await user.click(button);

    expect(screen.queryByRole('button', { name: 'Generative AI studio' })).not.toBeInTheDocument();
  });
});
