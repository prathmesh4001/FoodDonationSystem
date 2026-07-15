import { STATUS_COLORS } from '../../constants';

// Status Badge - using CSS custom properties
export const StatusBadge = ({ status, onImage = false }) => {
  const styles = {
    available: { color: '#15803d', dot: '#16a34a', border: 'rgba(22,163,74,0.4)' },
    claimed:   { color: '#92400e', dot: '#d97706', border: 'rgba(217,119,6,0.4)'  },
    delivered: { color: '#1d4ed8', dot: '#3b82f6', border: 'rgba(37,99,235,0.4)'  },
    expired:   { color: '#b91c1c', dot: '#ef4444', border: 'rgba(220,38,38,0.4)'  },
  };

  const s = styles[status?.toLowerCase()] || { color: '#475569', dot: '#94a3b8', border: 'rgba(148,163,184,0.4)' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 700,
        /* Always-visible frosted glass pill — works on any background image */
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${s.border}`,
        color: s.color,
        textTransform: 'capitalize',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
};


// Responsive Table
const Table = ({ columns, data, emptyMessage = 'No data available', loading = false }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '14px' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: '12px',
        border: '1px solid var(--border-card)',
      }}
    >
      <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              background: 'var(--bg-alt2)',
              borderBottom: '1px solid var(--border-card)',
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.7px',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row._id || rowIdx}
              style={{
                borderBottom: rowIdx < data.length - 1 ? '1px solid var(--border-card)' : 'none',
                background: 'var(--bg-card)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-alt2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: '12px 16px',
                    color: 'var(--text-body)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
