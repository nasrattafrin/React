import { useEffect, useState } from 'react';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

export default function DeliverymenList() {
  const [deliverymen, setDeliverymen] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = {
    name: '',
    contact_no: '',
    email: '',
    password: '',
    branch_id: '',
    address: '',
    status: 1,
  };
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    API.get('/deliverymen/index.php')
      .then(res => setDeliverymen(res.data.deliverymen || res.data.data || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  const loadBranches = () => {
    API.get('/branches/index.php')
      .then(res => {
        const list = res.data?.branches || res.data?.data || [];
        setBranches(list);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    loadBranches();
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (d) => {
    setForm({
      name: d.name || '',
      contact_no: d.contact_no || '',
      email: d.email || '',
      password: '',
      branch_id: d.branch_id || '',
      address: d.address || '',
      status: d.status ?? 1,
    });
    setEditingId(d.id);
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        // UPDATE — single.php
        const payload = {
          id: editingId,
          name: form.name,
          contact_no: form.contact_no,
          branch_id: Number(form.branch_id),
          address: form.address,
          status: Number(form.status),
        };
        if (form.password) payload.password = form.password;

        await API.put('/deliverymen/single.php', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // CREATE — create.php
        await API.post(
          '/deliverymen/create.php',
          {
            name: form.name,
            contact_no: form.contact_no,
            email: form.email,
            password: form.password,
            branch_id: Number(form.branch_id),
            address: form.address,
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this deliveryman?')) return;
    try {
      await API.delete(`/deliverymen/delete.php?id=${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Deliverymen</h4>
                <button className="btn btn-primary btn-sm" onClick={openCreate}>
                  + Add Deliveryman
                </button>
              </div>

              {showForm && (
                <form onSubmit={submit} className="bg-light p-3 rounded mb-4">
                  <h5 className="mb-3">
                    {editingId ? 'Edit Deliveryman' : 'New Deliveryman'}
                  </h5>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label>Name *</label>
                      <input className="form-control" value={form.name}
                        onChange={e => set('name', e.target.value)} required />
                    </div>
                    <div className="col-md-6 form-group">
                      <label>Contact No *</label>
                      <input className="form-control" value={form.contact_no}
                        onChange={e => set('contact_no', e.target.value)} required />
                    </div>

                    {!editingId && (
                      <div className="col-md-6 form-group">
                        <label>Email *</label>
                        <input className="form-control" type="email" value={form.email}
                          onChange={e => set('email', e.target.value)} required />
                      </div>
                    )}

                    <div className="col-md-6 form-group">
                      <label>
                        Password {editingId ? '(leave blank to keep current)' : '*'}
                      </label>
                      <input className="form-control" type="password" value={form.password}
                        onChange={e => set('password', e.target.value)}
                        required={!editingId} minLength={6}
                        placeholder={editingId ? 'Leave blank to keep' : 'Min 6 characters'} />
                    </div>

                    <div className="col-md-6 form-group">
                      <label>Branch *</label>
                      <select className="form-control" value={form.branch_id}
                        onChange={e => set('branch_id', e.target.value)} required>
                        <option value="">Select branch</option>
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>{b.branch_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 form-group">
                      <label>Address</label>
                      <input className="form-control" value={form.address}
                        onChange={e => set('address', e.target.value)} />
                    </div>

                    {editingId && (
                      <div className="col-md-6 form-group">
                        <label>Status</label>
                        <select className="form-control" value={form.status}
                          onChange={e => set('status', e.target.value)}>
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-success" type="submit" disabled={submitting}>
                      {submitting ? 'Saving...' : editingId ? 'Update' : 'Save'}
                    </button>
                    <button type="button" className="btn btn-light" onClick={resetForm}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {loading ? (
                <p className="text-muted">Loading...</p>
              ) : deliverymen.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No deliverymen yet.</p>
                  <button className="btn btn-primary btn-sm" onClick={openCreate}>
                    Add your first deliveryman
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Branch</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliverymen.map(d => (
                        <tr key={d.id}>
                          <td>{d.name}</td>
                          <td>{d.contact_no || '—'}</td>
                          <td>{d.email}</td>
                          <td>{d.branch_name || '—'}</td>
                          <td>
                            {Number(d.status) === 1 ? (
                              <span className="badge bg-success text-white">Active</span>
                            ) : (
                              <span className="badge bg-secondary text-white">Inactive</span>
                            )}
                          </td>
                          <td>
                            <button className="btn btn-primary btn-sm mr-2" onClick={() => openEdit(d)}>
                              Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => remove(d.id)}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}