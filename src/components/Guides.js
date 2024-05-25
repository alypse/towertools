import './Guides.scss';
import {GUIDELIST} from "../utils/Guidelist.js";
import { PanelGuides } from "./PanelGuides.js";


export function Guides() {

    return (
        <div className="list">
            {GUIDELIST.guides.map((guide, i) => (
                <div className='panel' key={guide.id}>
                    <PanelGuides guide={guide}/>
                </div>
            ))}
        </div>
    );
}


