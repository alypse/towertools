import './Apps.scss';
import {APPLIST} from "../utils/Applist.js";


export function Apps() {
    return (
        <div id="apps">
            <div className="list">
                <ul>
                    {APPLIST.apps.map((app) => (
                        <li key={app.id}>
                            <a href={app.url} target="_blank" rel="noreferrer">{app.name}</a>
                            <p>{app.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

