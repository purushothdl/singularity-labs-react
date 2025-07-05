import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import type { UserCreate } from '../types/api';
import { register as registerUser } from '../api/authService';

export const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<UserCreate>({
    mode: 'onBlur',
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generalApiError, setGeneralApiError] = useState<string | null>(null);

  const onSubmit = async (data: UserCreate) => {
    setIsLoading(true);
    setGeneralApiError(null);
    try {
      await registerUser(data);
      navigate('/success');
    } catch (error: any) {
      const errorDetail = error.response?.data?.detail;
      if (typeof errorDetail === 'object' && errorDetail !== null) {
        Object.entries(errorDetail).forEach(([fieldName, message]) => {
          if (fieldName === 'general') {
            setGeneralApiError(message as string);
          } else {
            setError(fieldName as keyof UserCreate, {
              type: 'server',
              message: message as string,
            });
          }
        });
      } else if (typeof errorDetail === 'string') {
        setGeneralApiError(errorDetail);
      } else {
        setGeneralApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src="/assets/backgrounds/stars.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <div className="w-full max-w-4xl p-3 bg-black/50 rounded-3xl shadow-lg flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 md:mr-3 flex flex-col bg-[#111516] rounded-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">Join Singularity Labs</h2>
              <p className="mt-2 text-sm text-gray-300">
                Pioneering the future of space travel since 2045. Register to unlock exclusive access to our nuclear engine innovations.
              </p>
            </div>
            <form className="mt-8 space-y-6 flex-grow" onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="username"
                label="Username"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
              <Input
                id="email"
                label="Email address"
                type="email"
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
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              {generalApiError && <p className="text-red-500 text-center text-sm">{generalApiError}</p>}
              <Button type="submit" isLoading={isLoading}>
                {isLoading ? 'Launching Your Account...' : 'Launch Account'}
              </Button>
            </form>
            <p className="mt-4 text-sm text-gray-300 text-center">
              Already part of the Singularity Labs mission?{' '}
              <Link to="/login" className="font-medium text-[#7b52f4] hover:text-[#6a42e3]">
                Sign in here
              </Link>
            </p>
          </div>
          <div className="hidden md:flex md:w-1/2 items-center justify-center mt-6 md:mt-0">
            <img
              src="/assets/images/afterburner.jpg"
              alt="Singularity Labs Nuclear Engine"
              className="rounded-2xl shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};