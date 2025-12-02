import { useState } from 'react';
import './Register.css';

const Register = () => {

    const [email, setEmail] = useState('');
    const [sname, setSname] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [isSending, setIsSending] = useState(false);

    return(
        <div className='register-container'>
            <div className='register-card'>
                <h1 className='register-title'>Регистация</h1>

                <p className="register-subtitle">
                    Введите данные для регистации
                </p>

                <form className='register-form'>
                    <div className='form-group'>
                        <input
                            type="text"
                            id="second-name"
                            value={sname}
                            onChange={(e) => setSname(e.target.value)}
                            placeholder="Фамилия"
                            className="form-input"
                            required
                            autoFocus
                        />

                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Имя"
                            className="form-input"
                            required
                            autoFocus
                        />

                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.ru"
                            className="form-input"
                            required
                            autoFocus
                        />

                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            className="form-input"
                            required
                            autoFocus
                        />

                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={isSending || !email || !sname || !name || !password}
                        >
                            {isSending ? 'Отправка...' : 'Получить код'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;