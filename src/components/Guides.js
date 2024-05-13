import './Guides.scss';
import {GUIDELIST} from "../utils/Guidelist.js";


export function Guides() {
    return (
        <div id="main">
            <div className="list">
                <ul>
                    {GUIDELIST.guides.map((guide) => (
                        <li key={guide.id}>
                            <h2>{guide.name}</h2>
                            <p>{guide.description}</p>
                            <a href={guide.url} target="_blank" rel="noreferrer">{guide.url}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


