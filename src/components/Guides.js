import './Guides.scss';
import {GUIDELIST} from "../utils/Guidelist.js";


export function Guides() {
    return (
        <div id="guides">
            <div className="list">
                <ul>
                    {GUIDELIST.guides.map((guide) => (
                        <li key={guide.id}>
                            <a href={guide.url} target="_blank" rel="noreferrer">{guide.name}</a>
                            <p>{guide.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


