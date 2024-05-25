import {useState} from "react";
import infoCircle from "../assets/static/info-circle.svg";


export function PanelGuides({guide}) {
    const [showDialog, setShowDialog] = useState(false);
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);

    return (
        <div>
            <div className='title'>
                <a className='app' href={guide.url} target="_blank" rel="noreferrer">{guide.name}</a>
                <div className='info'>
                    <button className='btn' onClick={() => open()}>
                        <img src={infoCircle} className='info-circle' alt='appinfo'/>
                    </button>
                </div>
            </div>
            <div>
                {showDialog && (
                    <div className='dialog'>
                        <div className='dialog-content' onClick={() => close()}>
                            <div className='details'>Created by {guide.author}</div>
                            <div className='description'>{guide.description}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
