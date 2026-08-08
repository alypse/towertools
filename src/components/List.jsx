import { Panel } from './Panel.jsx';
import './List.scss';

export function List({ items, favourites, onToggleFavourite, emptyMessage = 'Nothing matches your filters.' }) {
  if (items.length === 0) {
    return (
      <p className='list__empty' role='status'>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className='list'>
      {items.map(item => (
        <Panel key={item.key} item={item} isFavourite={favourites.includes(item.key)} onToggleFavourite={() => onToggleFavourite(item.key)} />
      ))}
    </div>
  );
}
