import { useEffect, useState } from 'react';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

export default function PricingList() {
  const [rules, setRules] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ zone_id: '', search: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    zone_id: '',
    min_weight: '',
    max_weight: '',
    charge: '',
  });
  const load = () => {
    setLoading(true);
    const params = {};
    if (filters.zone_id !== '') params.zone_id = filters.zone_id;
    if (filters.search) params.search = filters.search;
    API.get('/pricing/index.php', { params })
      .then(res => setRules(res.data.pricing || res.data.data || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };
  const loadZones = () => {
    API.get('/parcel/zones.php')
      .then(res => setZones(res.data.zones || []))
      .catch(() => {});
  };
  useEffect(() => {
    load();
    loadZones();
  }, [filters]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const openCreate = () => {
    setForm({ zone_id: '', min_weight: '', max_weight: '', charge: '' });
    setEditingId(null);
    setErrorMsg('');
    setShowModal(true);
  };
  const openEdit = (rule) => {
    setForm({
      zone_id: rule.zone_id,
      min_weight: rule.min_weight,
      max_weight: rule.max_weight,
      charge: rule.charge,
    });
    setEditingId(rule.id);
    setErrorMsg('');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setErrorMsg('');
  };
  const save = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.zone_id) return setErrorMsg('Zone is required');
    if (Number(form.min_weight) < 0) return setErrorMsg('Min weight cannot be negative');
    if (Number(form.max_weight) <= Number(form.min_weight)) {
      return setErrorMsg('Max weight must be greater than min weight');
    }
    if (Number(form.charge) < 0) return setErrorMsg('Charge cannot be negative');
    setSaving(true);
    try {
      const payload = {
        zone_id: Number(form.zone_id),
        min_weight: Number(form.min_weight),
        max_weight: Number(form.max_weight),
        charge: Number(form.charge),
      };
      if (editingId) {
        await API.put('/pricing/single.php', { id: editingId, ...payload }, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        await API.post('/pricing/create.php', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      closeModal();
      load();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this pricing rule?')) return;
    try {
      await API.delete(`/pricing/delete.php?id=${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };
  const previewZone = zones.find(z => String(z.id) === String(form.zone_id));
  const previewValid =
    previewZone &&
    form.min_weight !== '' &&
    form.max_weight !== '' &&
    form.charge !== '';
  return (
    <Layout>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Pricing Rules</h4>
                <button className="btn btn-primary btn-sm" onClick={openCreate}>
                  + Add Rule
                </button>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <select
                    className="form-control"
                    value={filters.zone_id}
                    onChange={e => setFilters(f => ({ ...f, zone_id: e.target.value }))} >
                    <option value="">All zones</option>
                    {zones.map(z => (
                      <option key={z.id} value={z.id}>{z.zone_name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    placeholder="Search by charge or weight"
                    value={filters.search}
                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
                </div>
              </div>
              {loading ? (
                <p className="text-muted">Loading...</p>
              ) : rules.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No pricing rules found.</p>
                  <button className="btn btn-primary btn-sm" onClick={openCreate}>
                    Add your first rule
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Zone</th>
                        <th>Weight Range</th>
                        <th>Charge</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rules.map(r => (
                        <tr key={r.id}>
                          <td>{r.zone_name}</td>
                          <td>{Number(r.min_weight)} – {Number(r.max_weight)} kg</td>
                          <td>৳{r.charge}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-primary mr-1"
                              title="Edit"
                              onClick={() => openEdit(r)}>
                              <i className="typcn typcn-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              title="Delete"
                              onClick={() => remove(r.id)} >
                              <i className="typcn typcn-trash"></i>
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

      {showModal && (
        <>
          <div
            className="modal-backdrop show"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={closeModal}></div>
          <div
            className="modal show d-block"
            style={{ zIndex: 1050 }}
            tabIndex="-1"
            role="dialog" >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingId ? 'Edit Pricing Rule' : 'Add Pricing Rule'}
                  </h5>
                  <button type="button" className="close" onClick={closeModal}>
                    <span>&times;</span>
                  </button>
                </div>

                <form onSubmit={save}>
                  <div className="modal-body">
                    {errorMsg && (
                      <div className="alert alert-danger py-2">{errorMsg}</div>
                    )}

                    <div className="form-group">
                      <label>Zone *</label>
                      <select
                        className="form-control"
                        value={form.zone_id}
                        onChange={e => set('zone_id', e.target.value)}
                        required >
                        <option value="">Select zone</option>
                        {zones.map(z => (
                          <option key={z.id} value={z.id}>{z.zone_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>Min Weight (kg) *</label>
                        <input
                          className="form-control"
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.min_weight}
                          onChange={e => set('min_weight', e.target.value)}
                          required />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Max Weight (kg) *</label>
                        <input
                          className="form-control"
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.max_weight}
                          onChange={e => set('max_weight', e.target.value)}
                          required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Charge (৳) *</label>
                      <input
                        className="form-control"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.charge}
                        onChange={e => set('charge', e.target.value)}
                        required />
                    </div>
                    {previewValid && (
                      <div className="alert alert-info py-2 mb-0">
                        <small>
                          <strong>Preview:</strong> Parcels {form.min_weight}–{form.max_weight} kg
                          in {previewZone.zone_name} will cost ৳{form.charge}
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={closeModal}
                      disabled={saving}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={saving}>
                      {saving ? 'Saving...' : editingId ? 'Update Rule' : 'Save Rule'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}