import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { login as loginUser } from '../api/authService';
import { useAuth } from '../context/AuthContext';

type LoginFormInputs = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormInputs>({
    mode: 'onBlur',
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generalApiError, setGeneralApiError] = useState<string | null>(null);
  const { login } = useAuth();


  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setGeneralApiError(null);
    try {
      const response = await loginUser(data.email, data.password);
      login(response.access_token); // Use the context login function
      navigate('/chat'); // Navigate directly to chat
    } catch (error: any) {
      const errorDetail = error.response?.data?.detail;
      if (typeof errorDetail === 'object' && errorDetail !== null) {
        Object.entries(errorDetail).forEach(([fieldName, message]) => {
          if (fieldName === 'general') {
            setGeneralApiError(message as string);
          } else {
            setError(fieldName as keyof LoginFormInputs, {
              type: 'server',
              message: message as string,
            });
          }
        });
      } else if (typeof errorDetail === 'string') {
        setGeneralApiError(errorDetail);
      } else {
        setGeneralApiError('Invalid credentials or an unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src="src/assets/backgrounds/bg1.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <div className="w-full max-w-md p-8 bg-black/50 rounded-3xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Welcome to Singularity Labs</h2>
            <img
              src="src/assets/icons/login.png"
              alt="Login Icon"
              className="mx-auto mt-4 w-48 h-25"
            />
            <p className="mt-2 text-sm text-gray-300">
              Meet Orion, your AI assistant for seamless scheduling with our engineers, technicians, and management. Log in to get started.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
              })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            {generalApiError && <p className="text-red-500 text-center text-sm">{generalApiError}</p>}
            <Button type="submit" isLoading={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-300 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-[#7b52f4] hover:text-[#6a42e3]">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};