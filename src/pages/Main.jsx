import './Main.scss';
import {useInputState, capitalizeAll} from "../utils/hooks";
import {Apps} from "../components/Apps.js";
import {Guides} from "../components/Guides.js";
import React from "react";


export const VIEWS = {
    APPS: 'Apps',
    GUIDES: 'Guides',
}

const Main = () => {
    const [view, setView] = useInputState(VIEWS.APPS, 'view');
    return (
        <div id='main'>
            <div className='nav'>
                {Object.entries(VIEWS).map(([key, value]) => (
                    <button
                        style={view === value ? {border: '1px solid rgb(10, 200, 255)'} : {border: '1px solid rgb(100, 100, 120)'}}
                        key={key} type='button' value={value} onClick={setView}>
                        {capitalizeAll(value)}
                    </button>
                ))}
            </div>
            {view === VIEWS.APPS && <Apps/>}
            {view === VIEWS.GUIDES && <Guides/>}
            <p style={{margin: '10px', fontSize: 'smaller'}}>Inspired by Skye, created by Alypse. Thank you, Skye!</p>
        </div>
    );
};

export default Main;
