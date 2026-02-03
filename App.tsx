import React, { useState } from 'react';
import AdminView from './components/AdminView';
import JournalistView from './components/JournalistView';

const App: React.FC = () => {
  // Default to the simple, user-facing 'journalist' view.
  const [userRole, setUserRole] = useState<'journalist' | 'root'>('journalist');

  const handleSwitchView = () => {
    setUserRole(current => (current === 'journalist' ? 'root' : 'journalist'));
  };

  // Render the appropriate view based on the current user role.
  // This structure separates the complex admin interface from the simple journalist workspace.
  return (
    <div className="h-screen w-screen">
      {userRole === 'journalist' ? (
        <JournalistView onSwitchToAdmin={handleSwitchView} />
      ) : (
        <AdminView onSwitchToJournalist={handleSwitchView} />
      )}
    </div>
  );
};

export default App;
