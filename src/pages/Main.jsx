import './Main.scss';
import { useInputState, capitalizeAll } from "../utils/hooks";
import { Apps } from "../components/Apps.js";
import { Guides } from "../components/Guides.js";
import React from "react";


export const VIEWS = {
    APPS: 'Apps',
    GUIDES: 'Guides'
}

const Main = () => {
    const [view, setView] = useInputState(VIEWS.APPS, 'view');
    return (
        <div id='main'>
            <div className='nav'>
                {Object.entries(VIEWS).map(([key,value]) => (
                    <button key={key} type='button' value={value} onClick={setView}>
                        {capitalizeAll(value)}
                    </button>
                ))}
            </div>
            {view === VIEWS.APPS && <Apps />}
            {view === VIEWS.GUIDES && <Guides />}
        </div>
    );
};

export default Main;
