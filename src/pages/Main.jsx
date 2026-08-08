import { useMemo, useState } from 'react';
import { List } from '../components/List.jsx';
import { SORTS, Toolbar } from '../components/Toolbar.jsx';
import { ThemeToggle } from '../components/ThemeToggle.jsx';
import { ChevronIcon, SlidersIcon } from '../components/icons.jsx';
import { APPLIST } from '../utils/Applist.js';
import { GUIDELIST } from '../utils/Guidelist.js';
import { useMediaQuery, useUpdatedState } from '../utils/hooks.js';
import { useTheme } from '../utils/useTheme.js';
import logo from '../assets/apps/logo.webp';
import './Main.scss';

export const VIEWS = {
  APPS: 'Apps',
  GUIDES: 'Guides',
};

const SOURCES = {
  [VIEWS.APPS]: { items: APPLIST.apps, kind: 'app' },
  [VIEWS.GUIDES]: { items: GUIDELIST.guides, kind: 'guide' },
};

// Wide enough for the tabs and the theme selector to share the sticky bar; below
// it the selector drops back into the collapsible options panel. Mirrors $bp-md,
// but lives here because the breakpoint moves a node rather than restyling one.
const SINGLE_ROW = '(min-width: 900px)';

// Ids are only unique within their own list, so favourites are keyed by both.
const keyFor = (kind, id) => `${kind}:${id}`;

const matches = (item, query) => [item.name, item.description, item.author].some(field => field.toLowerCase().includes(query));

const Main = () => {
  const { mode, rolled, setMode, reroll } = useTheme();
  const singleRow = useMediaQuery(SINGLE_ROW);

  const [view, setView] = useUpdatedState(VIEWS.APPS, 'view');
  const [sort, setSort] = useUpdatedState(SORTS.DEFAULT, 'sort');
  const [favourites, setFavourites] = useUpdatedState([], 'favourites');
  const [activeAuthors, setActiveAuthors] = useUpdatedState([], 'authors');
  const [controlsOpen, setControlsOpen] = useUpdatedState(true, 'controls');
  const [search, setSearch] = useState('');

  const source = SOURCES[view] ?? SOURCES[VIEWS.APPS];

  // Every entry carries a stable composite key used for favourites and React keys.
  const items = useMemo(() => source.items.map(item => ({ ...item, key: keyFor(source.kind, item.id) })), [source]);

  // Authors come from the data rather than a hardcoded list, so new entries
  // surface their author automatically.
  const authors = useMemo(() => [...new Set(items.map(item => item.author))].sort((a, b) => a.localeCompare(b)), [items]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = items.filter(item => {
      if (activeAuthors.length > 0 && !activeAuthors.includes(item.author)) return false;
      if (query.length > 0 && !matches(item, query)) return false;
      return true;
    });

    const sorted = [...filtered];
    if (sort === SORTS.NAME) sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === SORTS.AUTHOR) sorted.sort((a, b) => a.author.localeCompare(b.author) || a.name.localeCompare(b.name));

    // Pinned entries float to the top of whatever ordering is active.
    return sorted.sort((a, b) => Number(favourites.includes(b.key)) - Number(favourites.includes(a.key)));
  }, [items, activeAuthors, search, sort, favourites]);

  const toggleFavourite = key => setFavourites(current => (current.includes(key) ? current.filter(entry => entry !== key) : [...current, key]));

  const toggleAuthor = author => setActiveAuthors(current => (current.includes(author) ? current.filter(entry => entry !== author) : [...current, author]));

  const filtersActive = search.trim().length > 0 || activeAuthors.length > 0;

  const clearFilters = () => {
    setSearch('');
    setActiveAuthors([]);
  };

  const changeView = nextView => {
    setView(nextView);
    clearFilters();
  };

  // Rendered into the sticky bar when there is room beside the tabs, and into the
  // options panel otherwise, so narrow screens can still collapse it away.
  const themeToggle = <ThemeToggle mode={mode} rolled={rolled} onSelect={setMode} onReroll={reroll} />;

  return (
    <div className='shell'>
      <header className='shell__header'>
        <div className='brand'>
          <img className='brand__logo' src={logo} alt='' />
          <div>
            <h1 className='brand__name'>Tower Tools</h1>
            <p className='brand__tagline'>Community tools, calculators and guides for The Tower.</p>
          </div>
        </div>
        <button
          type='button'
          className='options-toggle'
          aria-expanded={controlsOpen}
          aria-controls='site-controls'
          onClick={() => setControlsOpen(open => !open)}
        >
          <SlidersIcon />
          <span className='options-toggle__text'>Options</span>
          {/* Filters keep applying while collapsed, so flag that from the button
              rather than leaving a short list looking unexplained. */}
          {!controlsOpen && filtersActive && <span className='options-toggle__dot' />}
          {!controlsOpen && filtersActive && <span className='visually-hidden'>Filters active</span>}
          <ChevronIcon className='options-toggle__chevron' />
        </button>
      </header>

      <div className='view-bar'>
        <nav className='view-tabs' aria-label='Sections'>
          {Object.values(VIEWS).map(value => (
            <button
              key={value}
              type='button'
              className={`view-tabs__tab${view === value ? ' is-active' : ''}`}
              aria-current={view === value}
              onClick={() => changeView(value)}
            >
              {value}
            </button>
          ))}
        </nav>

        {singleRow && themeToggle}
      </div>

      <main className='shell__main'>
        <div id='site-controls' className={`controls${controlsOpen ? '' : ' is-collapsed'}`}>
          <div className='controls__inner'>
            {!singleRow && themeToggle}

            <Toolbar
              search={search}
              onSearchChange={setSearch}
              sort={sort}
              onSortChange={setSort}
              authors={authors}
              activeAuthors={activeAuthors}
              onToggleAuthor={toggleAuthor}
              onClear={clearFilters}
              resultCount={visible.length}
              totalCount={items.length}
            />
          </div>
        </div>

        <List items={visible} favourites={favourites} onToggleFavourite={toggleFavourite} />
      </main>

      <footer className='shell__footer'>
        <p>Inspired by Skye, created by Alypse. Thank you, Skye!</p>
      </footer>
    </div>
  );
};

export default Main;
