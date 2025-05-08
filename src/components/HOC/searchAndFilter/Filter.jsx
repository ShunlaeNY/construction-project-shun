import React from 'react'

export default function Filter({uniqueStatuses, onSelect, isVisible}) {
    if (!isVisible) return null;
  return (
    <div className="filterDropDown">
      {uniqueStatuses.map((status) => (
        <p key={status} onClick={() => onSelect(status)}>
          {status}
        </p>
      ))}
    </div>
  )
}
