import { useState, type FormEvent } from "react";
import { useSendOtpMutation } from "../services/api";
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');

    const [sendOtp, { isLoading, error }] = useSendOtpMutation();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
          const result = await sendOtp({email}).unwrap();
          console.log('Успешно:', result);
        } catch (err) {
            console.error('Ошибка:', err)
        }
    };

    return (
        <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Вход в админ-панель</h1>
        <p className="login-subtitle">
          Введите email для получения одноразового кода
        </p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="form-input"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              Произошла ошибка при отправке кода
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || !email}
          >
            {isLoading ? 'Отправка...' : 'Получить код'}
          </button>
        </form>
      </div>
    </div>
    );
};

export default Login;