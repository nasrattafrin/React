
const STYLES = {
  0: 'bg-warning text-dark',
  1: 'bg-info text-white',
  2: 'bg-primary text-white',
  3: 'bg-success text-white',
  4: 'bg-danger text-white',
};
const LABELS = { 0: 'Pending', 1: 'Picked', 2: 'In Transit', 3: 'Delivered', 4: 'Cancelled' };

export default function StatusBadge({ status }) {
  const s = Number(status);
  return (
    <span className={`badge ${STYLES[s] || 'bg-secondary text-white'}`}>
      {LABELS[s] || 'Unknown'}
    </span>
  );
}