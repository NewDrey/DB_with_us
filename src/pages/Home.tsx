import {Link} from "react-router-dom";
import logo from '../logo.svg';

export const Home = ()=> {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <h1>Домашняя страница</h1>
                <p>
                    Добро пожаловать на главную страницу!
                </p>
                <nav>
                    <Link to="/about" className="App-link">О нас</Link>
                    <Link to="/contact" className="App-link" style={{marginLeft: '20px'}}>Контакты</Link>
                </nav>
            </header>
        </div>
    );
}