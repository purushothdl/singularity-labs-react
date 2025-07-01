import { Link } from 'react-router-dom';

export const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-400">Success!</h1>
        <p className="mt-4 text-lg text-gray-300">
          Your action was completed successfully.
        </p>
        <Link to="/chat" className="mt-8 inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Go to Chat
        </Link>
      </div>
    </div>
  );
};