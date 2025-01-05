import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-6">
      <h1 className="text-8xl font-bold text-gray-800">404</h1>
      <p className="text-2xl mt-4 text-gray-600">We are working on It will be Seen Soon.</p>
      <p className="text-gray-500 mt-2">Coming Soon...</p>
      <Link to="/" className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
        Go Back to Home
      </Link>
    </section>
  );
}

export default PageNotFound;
