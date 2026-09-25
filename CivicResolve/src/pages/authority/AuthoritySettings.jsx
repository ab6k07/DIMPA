import React from 'react';

export const AuthoritySettings = ({ c }) => {
  return (
    <div className="card max-w-md grid gap-3">
      <b>Settings</b>
      <div className="flex justify-between items-center">
        <span>Auto-assign by AI category</span>
        <input type="checkbox" defaultChecked aria-label="Auto assign" />
      </div>
      <div className="flex justify-between items-center">
        <span>Notify citizens on status change</span>
        <input type="checkbox" defaultChecked aria-label="Notify" />
      </div>
      <button
        type="button"
        className="btn w-fit"
        onClick={() => c.tst('Settings saved')}
      >
        Save
      </button>
    </div>
  );
};

export default AuthoritySettings;
