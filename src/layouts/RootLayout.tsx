import { Link, Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Art Gallery
          </Link>
          <ul className="flex gap-6 text-sm font-medium">
            <li><Link to="/" className="hover:text-gray-600">Home</Link></li>
            <li><Link to="/about" className="hover:text-gray-600">About</Link></li>
            <li><Link to="/contact" className="hover:text-gray-600">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Art Gallery
      </footer>
    </div>
  );
}
