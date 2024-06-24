import {useState} from "react";
import infoCircle from "../assets/static/info-circle.svg";


export function PanelApps({app}) {
    const [showDialog, setShowDialog] = useState(false);
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);

    return (
        <div>
            <div className='title'>
                <img className='icon' src={app.icon} alt={app.name}/>
                <a className='app' href={app.url} target="_blank" rel="noreferrer">{app.name}</a>
                <div className='info'>
                    <button className='btn' onClick={() => showDialog ? close() : open()}>
                        <img src={infoCircle} className='info-circle' alt='appinfo'/>
                    </button>
                </div>
            </div>
            {showDialog && (
                <div className='dialog' onClick={() => close()}>
                    <div className='details'>Created by {app.author}</div>
                    <div className='description'>{app.description}</div>
                </div>
            )}
        </div>
    );
}
