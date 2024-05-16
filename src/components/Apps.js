import { useState } from "react";
import './Apps.scss';
import {APPLIST} from "../utils/Applist.js";


export function Apps() {
    const [expanded, setExpanded] = useState(null);
    const toggle = i => {
        if (expanded === i) {
            setExpanded(null);

        }
        setExpanded(i);
    };

    return (
        <div className="list">
            {APPLIST.apps.map((app, i) => (
                <div className='item' key={app.id}>
                    <div className='title'>
                        <a className='app' href={app.url} target="_blank" rel="noreferrer">{app.name}</a>
                        <div className='expander' onClick={() => toggle(i)}>
                            {expanded === i ? '-' : '+'}
                        </div>
                    </div>
                    <div className={expanded === i ? 'content show' : 'content'}>
                        <div className='description'>{app.description}</div>
                        <div className='details'>Author: {app.author}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

