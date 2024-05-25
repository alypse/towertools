import './Apps.scss';
import { APPLIST } from "../utils/Applist.js";
import { PanelApps } from "./PanelApps.js";

// APPLIST.apps.map(app => require(app.icon));  todo: figure out how to require all icons


export function Apps() {
    return (
        <div className="list">
            {APPLIST.apps.map((app, i) => (
                <div className='panel' key={app.id}>
                    <PanelApps app={app}/>
                </div>
            ))}
        </div>
    );
}



