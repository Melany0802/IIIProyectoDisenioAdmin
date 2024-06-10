import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-white py-4 shadow-sm dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <Link to="/" className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Company Name
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            to="/menu"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Menu
          </Link>
          <Link
            to="/orders"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Orders
          </Link>
          <Link
            to="/services"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
