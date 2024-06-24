import './Apps.scss';
import {APPLIST} from "../utils/Applist.js";
import {PanelApps} from "./PanelApps.js";


export function Apps() {
    return (
        <div className="list">
            {APPLIST.apps.map((app) => (
                <div className='panel' key={app.id}>
                    <PanelApps app={app}/>
                </div>
            ))}
        </div>
    );
}



