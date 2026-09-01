function StatusPill({ status }) {
  const toneMap = {
    Resolved: 'resolved',
    'In progress': 'progress',
    Pending: 'pending',
    Escalated: 'escalated',
  }

  return <span className={`status-pill ${toneMap[status] || 'pending'}`}>{status}</span>
}

export default StatusPill
