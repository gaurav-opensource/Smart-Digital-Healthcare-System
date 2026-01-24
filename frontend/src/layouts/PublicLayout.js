import { Outlet } from "react-router-dom";


// Public Layout Component
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Page Content */}
      <main className="flex-grow flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
