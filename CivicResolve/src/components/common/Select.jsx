import React from 'react';

export const Select = ({ v, set, o, all, l, className = 'inp' }) => {
  return (
    <select
      className={className}
      aria-label={l}
      value={v}
      onChange={(e) => set(e.target.value)}
    >
      {all && <option value="">{all}</option>}
      {o.map((x) => (
        <option key={x} value={x}>
          {x}
        </option>
      ))}
    </select>
  );
};

export default Select;
