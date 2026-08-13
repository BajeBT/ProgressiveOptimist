import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Building2, AlertCircle, CheckCircle2, Plus } from 'lucide-react';

const BLANK_CLUB = {
  name: '',
  motto: '',
  charterYear: '',
  isHost: false,
  location: '',
  meetingSchedule: '',
  email: '',
  phone: '',
  website: '',
  description: '',
  initiatives: []
};

// Add/edit form for a single Barbados club directory entry. Pass `club` to
// edit an existing one, or omit it to create a new one.
export const BarbadosClubModal = ({ isOpen, onClose, club }) => {
  const { addBarbadosClub, updateBarbadosClub } = useAuth();
  const isEditing = Boolean(club);

  const [formData, setFormData] = useState(BLANK_CLUB);
  const [newInitiative, setNewInitiative] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(club ? { ...BLANK_CLUB, ...club } : BLANK_CLUB);
      setNewInitiative('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen, club]);

  if (!isOpen) return null;

  const addInitiative = () => {
    const trimmed = newInitiative.trim();
    if (!trimmed) return;
    setFormData(prev => ({ ...prev, initiatives: [...prev.initiatives, trimmed] }));
    setNewInitiative('');
  };

  const removeInitiative = (idx) => {
    setFormData(prev => ({ ...prev, initiatives: prev.initiatives.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || formData.name.trim().length < 3) {
      setError('Club name must be at least 3 characters long.');
      return;
    }

    setIsSaving(true);
    const result = isEditing
      ? await updateBarbadosClub(club.id, formData)
      : await addBarbadosClub(formData);
    setIsSaving(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      setError(result.message || 'Failed to save the club.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">

        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gold-gradient text-slate-950 rounded-t-3xl">
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-5 h-5" />
            <div>
              <h2 className="font-heading text-xl font-bold">
                {isEditing ? 'Edit Barbados Club' : 'Add Barbados Club'}
              </h2>
              <span className="text-[11px] font-bold text-slate-800 block">
                Appears on the public /barbados-clubs directory page
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-black/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Club {isEditing ? 'updated' : 'added'} successfully!</span>
            </div>
          )}

          {/* Name & Motto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Club Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Optimist Club of Barbados Bridgetown"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Motto
              </label>
              <input
                type="text"
                value={formData.motto}
                onChange={e => setFormData({ ...formData, motto: e.target.value })}
                placeholder="e.g. Friend of Youth"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              />
            </div>
          </div>

          {/* Charter Year & Host toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Charter Year
              </label>
              <input
                type="text"
                value={formData.charterYear}
                onChange={e => setFormData({ ...formData, charterYear: e.target.value })}
                placeholder="e.g. 1994"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              />
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <strong className="block text-xs text-slate-900 dark:text-white">Host Organization</strong>
                <span className="text-[11px] text-slate-500">Highlights this club as the site's home club.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.isHost}
                onChange={e => setFormData({ ...formData, isHost: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-optimist-blue focus:ring-optimist-blue"
              />
            </div>
          </div>

          {/* Location & Meeting Schedule */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Venue / Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Bridgetown, St. Michael, Barbados"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Meeting Schedule
            </label>
            <input
              type="text"
              value={formData.meetingSchedule}
              onChange={e => setFormData({ ...formData, meetingSchedule: e.target.value })}
              placeholder="e.g. 2nd & 4th Tuesday of every month at 6:00 PM"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
            />
          </div>

          {/* Contact fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. info@example.org"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +1 (246) 836-6185"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="A short description of the club's focus and community work..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
            />
          </div>

          {/* Initiatives */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Primary Initiatives
            </label>

            {formData.initiatives.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {formData.initiatives.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeInitiative(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newInitiative}
                onChange={e => setNewInitiative(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInitiative(); } }}
                placeholder="e.g. Youth Leadership Workshops"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
              />
              <button
                type="button"
                onClick={addInitiative}
                className="px-4 py-2.5 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between space-x-3">
            {isEditing ? (
              <span className="text-[11px] text-slate-400 self-center">Editing "{club.name}"</span>
            ) : <span />}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl gold-gradient text-slate-950 font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Building2 className="w-4 h-4 text-slate-950" />
                {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Club'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
