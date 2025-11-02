import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Главная страница</h1>
                <p>Добро пожаловать в административную панель!</p>
            
                <button 
                className="nav-button"
                onClick={() => navigate('/login')}
                >
                    Перейти на страницу логина
                </button>
            </div>
        </div>
    );
};

export default Home;