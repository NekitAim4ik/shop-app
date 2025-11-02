import { Navigate } from 'react-router-dom';
import './Home.css';

const Protected = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Защищенная страница</h1>
                <p>Добро пожаловать в административную панель!</p>
            </div>
        </div>
    );
};

export default Protected;