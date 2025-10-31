import { useState, type FormEvent } from "react";
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            setError('Пожалуйста, введите корректный email')
            setIsLoading(false)
            return
        }

        try {
            console.log('Отправка OTP на email:', email);

            await new Promise(resolve => setTimeout(resolve, 1000));

             alert(`OTP код отправлен на ${email}`);
        } catch {
            setError('Произошла ошибка. Попробуйте снова.');
        } finally {
            setIsLoading(false)
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
              {error}
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