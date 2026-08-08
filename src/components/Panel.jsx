import { useId, useState } from 'react';
import { ExternalIcon, StarIcon } from './icons.jsx';
import './Panel.scss';

// Descriptions shorter than this fit inside the clamp, so no toggle is offered.
const CLAMP_THRESHOLD = 120;

/**
 * One card. Renders both apps and guides — guides simply have no `icon`, so the
 * difference between the two lists is data rather than a second component.
 */
export function Panel({ item, isFavourite, onToggleFavourite }) {
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();

  const expandable = item.description.length > CLAMP_THRESHOLD;
  const showBadge = item.status && item.status !== 'Supported';

  return (
    <article className={`panel${isFavourite ? ' is-favourite' : ''}`}>
      <div className='panel__top'>
        {item.icon && <img className='panel__icon' src={item.icon} alt='' loading='lazy' />}
        <div className='panel__heading'>
          <h3 className='panel__title'>
            <a href={item.url} target='_blank' rel='noreferrer'>
              {item.name}
              <ExternalIcon className='panel__external' />
            </a>
          </h3>
          <p className='panel__author'>by {item.author}</p>
        </div>
        <button
          type='button'
          className='panel__pin'
          aria-pressed={isFavourite}
          aria-label={isFavourite ? `Unpin ${item.name}` : `Pin ${item.name}`}
          title={isFavourite ? 'Unpin' : 'Pin to top'}
          onClick={onToggleFavourite}
        >
          <StarIcon filled={isFavourite} />
        </button>
      </div>

      <p id={descriptionId} className={`panel__description${expanded ? ' is-expanded' : ''}`}>
        {item.description}
      </p>

      {(expandable || showBadge) && (
        <div className='panel__foot'>
          {expandable ? (
            <button type='button' className='panel__more' aria-expanded={expanded} aria-controls={descriptionId} onClick={() => setExpanded(value => !value)}>
              {expanded ? 'Show less' : 'Show more'}
            </button>
          ) : (
            <span />
          )}
          {showBadge && <span className='panel__badge'>{item.status}</span>}
        </div>
      )}
    </article>
  );
}
