
const DOT_COLORS = {
  0: 'bg-warning',
  1: 'bg-info',
  2: 'bg-primary',
  3: 'bg-success',
  4: 'bg-danger',
};
const LABELS = { 0: 'Pending', 1: 'Picked', 2: 'In Transit', 3: 'Delivered', 4: 'Cancelled' };

export default function ParcelTimeline({ logs = [] }) {
  if (!logs.length) {
    return <p className="text-muted">No activity yet.</p>;
  }

  return (
    <div className="list-wrapper">
      <ul className="d-flex flex-column-reverse todo-list todo-list-custom">
        {logs.map((log, i) => {
          const isLast = i === logs.length - 1;
          const s = Number(log.status);
          return (
            <li key={log.id} className={isLast ? 'completed' : ''}>
              <div className="form-check">
                <label className="form-check-label">
                  <span className={`bullet ${DOT_COLORS[s] || 'bg-secondary'}`}></span>
                  <strong>{LABELS[s] || 'Unknown'}</strong>
                  {log.note && <span className="text-muted d-block small mt-1">{log.note}</span>}
                  {log.actor_name && (
                    <span className="text-muted d-block small mt-1">by {log.actor_name}</span>
                  )}
                  <span className="text-muted d-block small mt-1">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}