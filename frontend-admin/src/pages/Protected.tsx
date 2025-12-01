import { Navigate } from 'react-router-dom';
import './Protected.css';

const Protected = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        return <Navigate to="/login" replace />
    }

    return (
        <header className='header'>
            <div className='header-container'>
                <div className='logo'></div>

                <div className='right-section'>
                    <button className='orders'>orders</button>
                    <button className='cart'>cart</button>
                    <div className='profile'></div>
                </div>
            </div>
        </header>
    );
};

export default Protected;