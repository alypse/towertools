import './Apps.scss';
import {APPLIST} from "../utils/Applist.js";


export function Apps() {
    return (
        <div id="main">
            <div className="list">
                <ul>
                    {APPLIST.apps.map((app) => (
                        <li>
                            <h2>{app.name}</h2>
                            <p>{app.description}</p>
                            <a href={app.url} target="_blank" rel="noreferrer">{app.url}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

