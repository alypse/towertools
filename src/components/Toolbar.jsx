import { CloseIcon, SearchIcon } from './icons.jsx';
import './Toolbar.scss';

export const SORTS = {
  DEFAULT: 'default',
  NAME: 'name',
  AUTHOR: 'author',
};

const SORT_LABELS = {
  [SORTS.DEFAULT]: 'Curated order',
  [SORTS.NAME]: 'Name (A–Z)',
  [SORTS.AUTHOR]: 'Author (A–Z)',
};

export function Toolbar({ search, onSearchChange, sort, onSortChange, authors, activeAuthors, onToggleAuthor, onClear, resultCount, totalCount }) {
  const filtered = search.trim().length > 0 || activeAuthors.length > 0;

  return (
    <div className='toolbar'>
      <div className='toolbar__row'>
        <div className='toolbar__search'>
          <SearchIcon className='toolbar__search-icon' />
          <input
            type='search'
            className='toolbar__input'
            value={search}
            placeholder='Search by name, description or author…'
            aria-label='Search'
            onChange={event => onSearchChange(event.target.value)}
          />
        </div>

        <label className='toolbar__sort'>
          <span className='toolbar__sort-label'>Sort</span>
          <select className='toolbar__select' value={sort} onChange={event => onSortChange(event.target.value)}>
            {Object.values(SORTS).map(value => (
              <option key={value} value={value}>
                {SORT_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className='toolbar__row toolbar__row--chips'>
        <div className='toolbar__chips' role='group' aria-label='Filter by author'>
          {authors.map(author => {
            const active = activeAuthors.includes(author);
            return (
              <button key={author} type='button' className={`chip${active ? ' is-active' : ''}`} aria-pressed={active} onClick={() => onToggleAuthor(author)}>
                {author}
              </button>
            );
          })}
        </div>

        <p className='toolbar__count' role='status'>
          {resultCount === totalCount ? `${totalCount} total` : `${resultCount} of ${totalCount}`}
          {filtered && (
            <button type='button' className='toolbar__clear' onClick={onClear}>
              <CloseIcon />
              Clear
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
