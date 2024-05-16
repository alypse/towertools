import {useState} from "react";
import './Guides.scss';
import {GUIDELIST} from "../utils/Guidelist.js";


export function Guides() {
    const [expanded, setExpanded] = useState(null);
    const toggle = i => {
        if (expanded === i) {
            setExpanded(null);

        }
        setExpanded(i);
    };

    return (
        <div className="list">
            {GUIDELIST.guides.map((guide, i) => (
                <div className='item' key={guide.id}>
                    <div className='title'>
                        <a className='app' href={guide.url} target="_blank" rel="noreferrer">{guide.name}</a>
                        <div className='expander' onClick={() => toggle(i)}>
                            {expanded === i ? '-' : '+'}
                        </div>
                    </div>
                    <div className={expanded === i ? 'content show' : 'content'}>
                        <div className='description'>{guide.description}</div>
                        <div className='details'>Author: {guide.author}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}


