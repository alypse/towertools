import { useState } from "react";
import './Apps.scss';
import { APPLIST } from "../utils/Applist.js";
import infoCircle  from '../assets/static/info-circle.svg';

// APPLIST.apps.map(app => require(app.icon));  todo: figure out how to require all icons


export function Apps() {
    const [showDialog, setShowDialog] = useState(false);
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);

    return (
        <div className="list">
            {APPLIST.apps.map((app, i) => (
                <div className='item' key={app.id}>
                    <div className='title'>
                        <img className='icon' src={app.icon} alt={app.name}/>
                        <a className='app' href={app.url} target="_blank" rel="noreferrer">{app.name}</a>
                        <div className='info'>
                            <button className='btn' onClick={() => open()}>
                                <img src={infoCircle} className='info-circle' alt='appinfo'/>
                            </button>
                        </div>
                    </div>
                    <div>
                        {showDialog && (
                            <div className='dialog'>
                                <div className='dialog-content' onClick={(i) => close()}>
                                    <div className='name'>{APPLIST.apps[i].name}</div>
                                    <div className='details'>Created by {APPLIST.apps[i].author}</div>
                                    <div className='description'>{APPLIST.apps[i].description}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}



