import { useState } from 'react';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; 
import { setCurrentUserId, setUsers } from '../actions/userActions'; 
import { fetchUsersByEmail, registerUser } from '../api/userApi'; 

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const registrationSchema = z
  .object({
    email: z.string()
      .refine((value) => emailRegex.test(value), {
        message: 'Некорректный email',
      }),
    password: z.string()
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Пароль должен содержать хотя бы одну заглавную букву',
      })
      .refine((value) => /[a-z]/.test(value), {
        message: 'Пароль должен содержать хотя бы одну строчную букву',
      })
      .refine((value) => /\d/.test(value), {
        message: 'Пароль должен содержать хотя бы одну цифру',
      }),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли должны совпадать',
    path: ['confirmPassword'],
  });

const RegistrationPage = ({ setCurrentUserId, setUsers }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = registrationSchema.safeParse({ email, password, confirmPassword });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        email: formattedErrors.email?._errors[0],
        password: formattedErrors.password?._errors[0],
        confirmPassword: formattedErrors.confirmPassword?._errors[0],
      });
      return;
    }

    let existingUsers = [];

    try {
      existingUsers = await fetchUsersByEmail(email); 
      if (existingUsers.length > 0) {
        setErrors({ email: 'Этот email уже зарегистрирован.' });
        return;
      }
    } catch (error) {
      console.error('Ошибка при проверке email:', error);
      alert('Ошибка сети. Проверьте подключение.');
      return;
    }

    setErrors({});
    const newUser = {
      id: Date.now(),
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    try {
      const createdUser = await registerUser(newUser); 
      setCurrentUserId(createdUser.id); 
      setUsers([...existingUsers, createdUser]); 
      navigate('/login');
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка регистрации. Попробуйте снова.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Регистрация</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`mt-1 block w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`mt-1 block w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Повторите пароль</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`mt-1 block w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

const mapDispatchToProps = {
  setCurrentUserId,
  setUsers,
};

RegistrationPage.propTypes = {
  setCurrentUserId: PropTypes.func.isRequired,
  setUsers: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(RegistrationPage);