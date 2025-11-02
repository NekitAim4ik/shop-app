import { useState, type FormEvent, useEffect } from "react";
import { useSendOtpMutation, useConfirmOtpMutation } from "../services/api";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'email' | 'otp'>('email')

    const navigate = useNavigate();

    const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
    const [confirmOtp, {isLoading: isVerifying }] = useConfirmOtpMutation();

    useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    // Если уже авторизован - редирект на главную
    if (accessToken) {
      navigate('/admin')
    }
  }, [navigate]);


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
          await sendOtp({ email }).unwrap()
          setStep('otp')  // Переключаемся на шаг ввода OTP
        } catch (err) {
          console.error('Ошибка отправки OTP:', err)
        }
    };

    const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
          const result = await confirmOtp({ email, otp }).unwrap()
          localStorage.setItem('accessToken', result.accessToken);
          console.log('Успешная авторизация:', result)
          navigate('/admin');
          // Редирект на главную или сохранение токена
        } catch (err) {
          console.error('Неверный код:', err)
        }
    };

    const handleChangeEmail = () => {
        setStep('email')
        setOtp('')
    };

    return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Вход в админ-панель</h1>
        
        {/* ========== ШАГ 1: Ввод Email ========== */}
        {step === 'email' && (
          <>
            <p className="login-subtitle">
              Введите email для получения одноразового кода
            </p>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
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

              <button 
                type="submit" 
                className="submit-button"
                disabled={isSending || !email}
              >
                {isSending ? 'Отправка...' : 'Получить код'}
              </button>
            </form>
          </>
        )}

        {/* ========== ШАГ 2: Ввод OTP кода ========== */}
        {step === 'otp' && (
          <>
            <p className="login-subtitle">
              Введите код, отправленный на <strong>{email}</strong>
            </p>
            
            <form onSubmit={handleVerifyOtp} className="login-form">
              <div className="form-group">
                <label htmlFor="otp" className="form-label">Код подтверждения</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="form-input"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isVerifying || !otp}
              >
                {isVerifying ? 'Проверка...' : 'Подтвердить'}
              </button>

              {/* Кнопка для изменения email */}
              <button 
                type="button"
                onClick={handleChangeEmail}
                className="back-button"
              >
                Изменить email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;