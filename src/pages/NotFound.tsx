import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Cyberstar IT</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link
            to="/"
            className="inline-block rounded-lg bg-[var(--color-primary)] px-6 py-3 text-white font-semibold hover:bg-[var(--color-primary-light)] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}

export default NotFound;
