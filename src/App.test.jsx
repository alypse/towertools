import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './app.jsx';
import { APPLIST } from './utils/Applist.js';
import { GUIDELIST } from './utils/Guidelist.js';

const root = () => document.documentElement;

beforeEach(() => {
  localStorage.clear();
  root().removeAttribute('data-theme');
  root().removeAttribute('style');
});

afterEach(cleanup);

describe('app shell', () => {
  it('renders the brand and every app by default', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Tower Tools', level: 1 })).toBeInTheDocument();
    for (const app of APPLIST.apps) {
      expect(screen.getByRole('link', { name: new RegExp(app.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })).toBeInTheDocument();
    }
  });

  it('gives every entry a unique key, catching duplicate ids in the data', () => {
    const appIds = APPLIST.apps.map(app => app.id);
    const guideIds = GUIDELIST.guides.map(guide => guide.id);

    expect(new Set(appIds).size).toBe(appIds.length);
    expect(new Set(guideIds).size).toBe(guideIds.length);
  });

  it('switches between apps and guides', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Guides' }));

    expect(screen.getByRole('link', { name: /Build Guide/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Bot Calculator/i })).not.toBeInTheDocument();
  });
});

describe('toolbar', () => {
  it('filters by search across name, description and author', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'bot calculator');

    expect(screen.getByRole('link', { name: /Bot Calculator/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Cell Calculator/i })).not.toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'zzzznotathing');

    expect(screen.getByText(/nothing matches/i)).toBeInTheDocument();
  });

  it('filters by author chip and clears again', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Andy1292' }));

    expect(screen.getByRole('link', { name: /Enemy Level Skip Simulator/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Bot Calculator/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Clear/i }));

    expect(screen.getByRole('link', { name: /Bot Calculator/i })).toBeInTheDocument();
  });

  it('sorts by name', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByRole('combobox'), 'name');

    const titles = screen.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });
});

describe('options panel', () => {
  const panel = () => document.getElementById('site-controls');

  it('is expanded by default', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /Options/i })).toHaveAttribute('aria-expanded', 'true');
    expect(panel()).not.toHaveClass('is-collapsed');
  });

  it('collapses and expands the theme, search and filter controls', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Options/i }));

    expect(screen.getByRole('button', { name: /Options/i })).toHaveAttribute('aria-expanded', 'false');
    expect(panel()).toHaveClass('is-collapsed');

    await user.click(screen.getByRole('button', { name: /Options/i }));

    expect(screen.getByRole('button', { name: /Options/i })).toHaveAttribute('aria-expanded', 'true');
    expect(panel()).not.toHaveClass('is-collapsed');
  });

  it('remembers the collapsed state across a reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: /Options/i }));
    unmount();

    render(<App />);
    expect(panel()).toHaveClass('is-collapsed');
  });

  it('keeps filtering while collapsed and flags that on the button', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'bot calculator');
    await user.click(screen.getByRole('button', { name: /Options/i }));

    // The filter is still applied even though its controls are hidden.
    expect(screen.getByRole('link', { name: /Bot Calculator/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Cell Calculator/i })).not.toBeInTheDocument();
    expect(screen.getByText('Filters active')).toBeInTheDocument();
  });

  it('does not flag active filters when there are none', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Options/i }));

    expect(screen.queryByText('Filters active')).not.toBeInTheDocument();
  });
});

describe('favourites', () => {
  it('pins an entry to the top and persists it', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Pin Bot Calculator' }));

    const firstCard = screen.getAllByRole('article')[0];
    expect(within(firstCard).getByRole('heading', { level: 3 })).toHaveTextContent('Bot Calculator');

    unmount();
    render(<App />);

    expect(screen.getAllByRole('article')[0]).toHaveTextContent('Bot Calculator');
    expect(screen.getByRole('button', { name: 'Unpin Bot Calculator' })).toBeInTheDocument();
  });
});

describe('theme toggle', () => {
  it('applies an explicit light or dark choice to the document root', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Dark' }));
    expect(root()).toHaveAttribute('data-theme', 'dark');

    await user.click(screen.getByRole('button', { name: 'Light' }));
    expect(root()).toHaveAttribute('data-theme', 'light');
  });

  it('rolls a theme in TTG RNG mode and writes the palette as inline custom properties', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'TTG RNG' }));

    expect(root()).toHaveAttribute('data-theme', 'rng');
    expect(root().style.getPropertyValue('--bg')).toMatch(/^#[0-9a-f]{6}$/);
    expect(root().style.getPropertyValue('--accent')).toMatch(/^#[0-9a-f]{6}$/);
    expect(screen.getByRole('button', { name: /Reroll theme/i })).toBeInTheDocument();
  });

  it('clears the rolled palette when leaving RNG mode', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'TTG RNG' }));
    expect(root().style.getPropertyValue('--bg')).not.toBe('');

    await user.click(screen.getByRole('button', { name: 'Dark' }));
    expect(root().style.getPropertyValue('--bg')).toBe('');
  });

  it('keeps the rolled palette when switching away to light or dark and back', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'TTG RNG' }));
    const accent = root().style.getPropertyValue('--accent');
    const label = screen.getByRole('button', { name: /Reroll theme/i }).getAttribute('aria-label');

    await user.click(screen.getByRole('button', { name: 'Dark' }));
    await user.click(screen.getByRole('button', { name: 'Light' }));
    await user.click(screen.getByRole('button', { name: 'TTG RNG' }));

    expect(root().style.getPropertyValue('--accent')).toBe(accent);
    expect(screen.getByRole('button', { name: /Reroll theme/i })).toHaveAttribute('aria-label', label);
  });

  it('keeps the rolled palette across a reload while in light or dark mode', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'TTG RNG' }));
    const accent = root().style.getPropertyValue('--accent');

    await user.click(screen.getByRole('button', { name: 'Dark' }));
    unmount();

    render(<App />);
    await user.click(screen.getByRole('button', { name: 'TTG RNG' }));

    expect(root().style.getPropertyValue('--accent')).toBe(accent);
  });

  it('produces a different palette when rerolled', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'TTG RNG' }));

    const seen = new Set();
    for (let i = 0; i < 12; i += 1) {
      seen.add(root().style.getPropertyValue('--accent'));
      await user.click(screen.getByRole('button', { name: /Reroll theme/i }));
    }

    expect(seen.size).toBeGreaterThan(1);
  });
});
