'use client';

import Sidebar from './Sidebar';
import ProtectedRoute from './ProtectedRoute';

export default function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="app-container">
        <Sidebar />
        <main className="main-content animate-fade-in">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
