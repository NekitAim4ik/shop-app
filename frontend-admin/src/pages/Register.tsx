import { useState, useEffect, type FormEvent } from 'react';
import { useSendOptRegMutation, useConfirmOtpMutation } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {

    const [email, setEmail] = useState('');
    const [sname, setSname] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');

    const [step, setStep] = useState<'email' | 'otp'>('email');

    const [sendOtp, { isLoading: isSending }] = useSendOptRegMutation();
    const [confirmOtp, {isLoading: isVerifying }] = useConfirmOtpMutation();

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        // Если уже авторизован - редирект на главную
        if (accessToken) {
          navigate('/admin')
        }
      }, [navigate]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await sendOtp({
                sname,
                name,
                email,
                password
            }).unwrap();

            setStep('otp');
        } catch (err) {
            console.error('Ошибка отправки OTP:', err);
        }
    };

    const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const result = await confirmOtp({ email, otp }).unwrap();
            localStorage.setItem('accessToken', result.accessToken);
            console.log('Успешная регистрация:', result);
            navigate('/admin');
        } catch (err) {
            console.error('Неверный код:', err);
        }
    };

    const handleChangeEmail = () => {
        setStep('email')
        setOtp('')
    };

    return(
        <div className='register-container'>
            <div className='register-card'>
                <h1 className='register-title'>Регистация</h1>

                <p className="register-subtitle">
                    Введите данные для регистации
                </p>

                {step === 'email' && (
                    <>
                        <form onSubmit={handleSubmit} className='register-form'>
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
                    </>
                )}

                {step === 'otp' && (
                    <>
                        <p className="register-subtitle">
                            Введите код, отправленный на <strong>{email}</strong>
                        </p>

                        <form onSubmit={handleVerifyOtp} className="register-form">
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

export default Register;