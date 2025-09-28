import {Link} from "react-router-dom";

export const About = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>О нас</h1>
                <p>Информация о нашей компании</p>
                <Link to="/" className="App-link">На главную</Link>
            </header>
        </div>
    );
}

