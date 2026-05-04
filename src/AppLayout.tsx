import { Avatar } from 'antd';
import { Link, Outlet } from 'react-router';

const AppLayout = () => {
  return (
    <main className="absolute inset-0 overflow-hidden">
      <header className="flex items-center justify-between gap-8 border-b border-gray-300 bg-white p-4 md:px-8 md:py-4">
        <h1>
          <Link className="text-lg font-bold text-gray-800" to="/">
            Dispatch Dashboard
          </Link>
        </h1>
        <Avatar className="cursor-pointer">SF</Avatar>
      </header>
      <main className="h-[calc(100%-64px)] overflow-auto p-4 md:px-8 md:py-4">
        <Outlet />
      </main>
    </main>
  );
};

export default AppLayout;
