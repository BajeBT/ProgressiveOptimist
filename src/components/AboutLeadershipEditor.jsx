import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { defaultAboutLeadership } from '../data/aboutLeadershipData';
import { Plus, Save, Trash2 } from 'lucide-react';

const inputClass = "w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue";

// Each list: label, the row fields (key + label), and the blank row for "Add".
const SECTIONS = [
  {
    key: 'officers',
    label: 'Executive Officer Cards',
    fields: [['name', 'Name'], ['title', 'Title'], ['role', 'Description']],
    blank: { name: '', title: '', role: '', email: '', image: '/avatars/director_placeholder.jpg' }
  },
  {
    key: 'executiveRoles',
    label: 'Executive Officers Roster',
    fields: [['title', 'Role'], ['holder', 'Holder (leave blank if vacant)'], ['badge', 'Badge']],
    blank: { title: '', holder: '', badge: '' }
  },
  {
    key: 'directors',
    label: 'Board of Directors',
    fields: [['name', 'Name'], ['role', 'Role']],
    blank: { name: '', role: 'Board Director', image: '/avatars/director_placeholder.jpg' }
  },
  {
    key: 'pastPresidents',
    label: 'Honor Roll (Past Presidents)',
    fields: [['year', 'Year'], ['name', 'Name'], ['badge', 'Badge (optional)']],
    blank: { year: '', name: '', badge: '' }
  }
];

export const AboutLeadershipEditor = () => {
  const { siteSettings, updateSiteSettings } = useAuth();
  const [data, setData] = useState(() => ({ ...defaultAboutLeadership, ...(siteSettings?.aboutLeadership || {}) }));
  const [saved, setSaved] = useState(false);

  const setRows = (key, rows) => {
    setData(prev => ({ ...prev, [key]: rows }));
    setSaved(false);
  };
  const editCell = (key, idx, field, value) =>
    setRows(key, data[key].map((row, i) => (i === idx ? { ...row, [field]: value } : row)));

  const handleSave = (e) => {
    e.preventDefault();
    updateSiteSettings({ aboutLeadership: data });
    setSaved(true);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Edit the names, titles and years shown on the public About page. Changes go live as soon as you save.
      </p>

      {SECTIONS.map(section => (
        <div key={section.key} className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            {section.label}
          </h2>

          {data[section.key].map((row, idx) => (
            <div key={idx} className="flex items-end gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                {section.fields.map(([field, label]) => (
                  <label key={field} className="space-y-1 block">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{label}</span>
                    <input
                      type="text"
                      value={row[field] || ''}
                      onChange={e => editCell(section.key, idx, field, e.target.value)}
                      className={inputClass}
                    />
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setRows(section.key, data[section.key].filter((_, i) => i !== idx))}
                title="Remove this row"
                className="p-2.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setRows(section.key, [...data[section.key], { ...section.blank }])}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add row
          </button>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-optimist-blue text-white text-xs font-bold shadow flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save About Page
        </button>
        {saved && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Saved. The About page is updated.</span>}
      </div>
    </form>
  );
};
