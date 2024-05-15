import './Guides.scss';
import {GUIDELIST} from "../utils/Guidelist.js";


export function Guides() {
    return (
            <div className="list">
                    {GUIDELIST.guides.map((guide) => (
                        <div key={guide.id}>
                            <a href={guide.url} target="_blank" rel="noreferrer">{guide.name}</a>
                            <p>{guide.description}</p>
                        </div>
                    ))}
            </div>
    );
}


