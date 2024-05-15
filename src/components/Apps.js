import './Apps.scss';
import {APPLIST} from "../utils/Applist.js";


export function Apps() {
    return (
            <div className="list">
                    {APPLIST.apps.map((app) => (
                        <div key={app.id}>
                            <a href={app.url} target="_blank" rel="noreferrer">{app.name}</a>
                            <p>{app.description}</p>
                        </div>
                    ))}
            </div>
    );
}

