import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectCategories } from '../data/projectsData';
import { X, Upload, Image as ImageIcon, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, Info, FileImage, Lock } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB Limit
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const NewProjectModal = ({ isOpen, onClose }) => {
  const { currentUser, addProject } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Community Outreach',
    excerpt: '',
    content: '',
    impact: '',
    image: '',
    childrenServed: '',
    isFeatured: false
  });

  const [selectedFileMeta, setSelectedFileMeta] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle local image file upload preview with controls & limitations
  const handleImageUpload = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    // Control 1: Format validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(`Invalid file format (${file.type || 'unknown'}). Only JPEG, PNG, WEBP, and GIF images are permitted.`);
      e.target.value = '';
      return;
    }

    // Control 2: File size limit (5 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File size limit exceeded! Selected image is ${sizeMB} MB. Maximum allowed size is 5.0 MB.`);
      e.target.value = '';
      return;
    }

    const sizeMBStr = (file.size / (1024 * 1024)).toFixed(2);
    setSelectedFileMeta({ name: file.name, sizeStr: `${sizeMBStr} MB` });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (urlVal) => {
    setError('');
    setFormData(prev => ({ ...prev, image: urlVal }));
    if (urlVal.startsWith('http://') || urlVal.startsWith('https://')) {
      setImagePreview(urlVal);
      setSelectedFileMeta({ name: 'External Web Image', sizeStr: 'Remote URL' });
    } else {
      setImagePreview(null);
      setSelectedFileMeta(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check 0: Authentication control
    if (!currentUser) {
      setError('Authentication required. Please log in to your member portal account to publish projects.');
      return;
    }

    // Check 1: Title controls
    if (!formData.title || formData.title.trim().length < 5) {
      setError('Project Title must be at least 5 characters long.');
      return;
    }
    if (formData.title.length > 100) {
      setError('Project Title cannot exceed 100 characters.');
      return;
    }

    // Check 2: Short Summary / Excerpt controls
    if (!formData.excerpt || formData.excerpt.trim().length < 10) {
      setError('Short Summary / Excerpt must be at least 10 characters long.');
      return;
    }
    if (formData.excerpt.length > 200) {
      setError('Short Summary / Excerpt cannot exceed 200 characters.');
      return;
    }

    // Check 3: Full Project Details controls
    if (!formData.content || formData.content.trim().length < 20) {
      setError('Full Project Details narrative must be at least 20 characters long.');
      return;
    }
    if (formData.content.length > 2000) {
      setError('Full Project Details cannot exceed 2000 characters.');
      return;
    }

    // Check 4: Impact length limitation
    if (formData.impact && formData.impact.length > 80) {
      setError('Impact Highlight cannot exceed 80 characters.');
      return;
    }

    // Check 5: Image URL protocol validation if manual URL entered
    if (formData.image && !formData.image.startsWith('data:') && !formData.image.startsWith('http://') && !formData.image.startsWith('https://')) {
      setError('Invalid Image URL format. URL must begin with http:// or https://');
      return;
    }

    // Check 5.5: Children Impacted is mandatory for every project and event
    const kidsNum = parseInt(formData.childrenServed, 10);
    if (String(formData.childrenServed).trim() === '' || isNaN(kidsNum) || kidsNum < 0) {
      setError('Number of Children Impacted is required for every project and event. Enter 0 if no children were directly impacted.');
      return;
    }

    const result = addProject({
      ...formData,
      childrenServed: kidsNum,
      image: formData.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80'
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          title: '',
          category: 'Community Outreach',
          excerpt: '',
          content: '',
          impact: '',
          image: '',
          childrenServed: '',
          isFeatured: false
        });
        setImagePreview(null);
        setSelectedFileMeta(null);
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  const isOfficer = currentUser && ['super admin', 'finance', 'admin'].includes(currentUser.access);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gold-gradient text-slate-950 rounded-t-3xl">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5" />
            <div>
              <h2 className="font-heading text-xl font-extrabold">
                Post New Project / Activity
              </h2>
              <span className="text-[11px] font-bold text-slate-800 block">
                Official Member Submission Portal (Max 5 MB Photo Limit)
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

        {/* Member Credit & Submission Policy Banner */}
        {currentUser ? (
          <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover border border-amber-400" />
              <span className="text-slate-700 dark:text-slate-200">
                Author: <strong>{currentUser.name}</strong> (<span className="text-amber-600 dark:text-amber-400 font-mono">{currentUser.memberId}</span>)
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Member
            </span>
          </div>
        ) : (
          <div className="bg-amber-500/20 text-amber-900 dark:text-amber-200 px-6 py-2.5 text-xs font-bold flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>Guest submission disabled. Please log in to your Member Portal account first.</span>
          </div>
        )}

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
              <span>Project published successfully! Added to live club projects showcase and Neon database.</span>
            </div>
          )}

          {/* 1. Project Title */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Project Title *
              </label>
              <span className={`text-[10px] font-mono ${formData.title.length > 100 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {formData.title.length} / 100 chars (Min 5)
              </span>
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Back to School Book Bag & Tablet Drive 2025"
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              required
            />
          </div>

          {/* 2. Category & Impact Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              >
                {projectCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Impact Highlight (Optional)
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {formData.impact.length} / 80 chars
                </span>
              </div>
              <input
                type="text"
                value={formData.impact}
                onChange={e => setFormData({ ...formData, impact: e.target.value })}
                placeholder="e.g. Impacted 120 Bajan Children"
                maxLength={80}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              />
            </div>
          </div>

          {/* Children Impacted input (Mandatory for every project and event) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 font-extrabold text-optimist-blue dark:text-amber-400">
              Number of Children Impacted *
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.childrenServed}
              onChange={e => setFormData({ ...formData, childrenServed: e.target.value })}
              placeholder="e.g. 150 (enter 0 if no children were directly impacted)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              required
            />
            <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              Counts toward the Children Reached total on the homepage. Required for every category, including fundraisers and meetings.
            </p>
          </div>

          {/* 3. Short Summary / Excerpt */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Short Summary / Excerpt *
              </label>
              <span className={`text-[10px] font-mono ${formData.excerpt.length > 200 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {formData.excerpt.length} / 200 chars (Min 10)
              </span>
            </div>
            <input
              type="text"
              value={formData.excerpt}
              onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief 1-2 sentence description summarizing the main objective"
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              required
            />
          </div>

          {/* 4. Full Project Narrative */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Full Project Narrative & Details *
              </label>
              <span className={`text-[10px] font-mono ${formData.content.length > 2000 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {formData.content.length} / 2000 chars (Min 20)
              </span>
            </div>
            <textarea
              rows={4}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Detailed narrative describing what was accomplished, venue/school location in Barbados, partners involved, and volunteer highlights..."
              maxLength={2000}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              required
            />
          </div>

          {/* 5. Photo Upload Controls & File Limitations */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileImage className="w-4 h-4 text-optimist-blue" />
                Project Cover Photo Upload Controls
              </label>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/40">
                Max 5 MB Limit (PNG/JPG/WEBP)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="cursor-pointer w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-dashed border-optimist-blue text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all">
                <Upload className="w-4 h-4 text-optimist-blue" />
                <span>Select Photo File (&lt; 5MB)</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-slate-400 font-bold">OR</span>

              <input
                type="url"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={e => handleUrlChange(e.target.value)}
                placeholder="Paste Image URL (https://...)"
                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
              />
            </div>

            {selectedFileMeta && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>File Verified: <strong>{selectedFileMeta.name}</strong></span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100">
                  {selectedFileMeta.sizeStr}
                </span>
              </div>
            )}

            {imagePreview && (
              <div className="relative h-36 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700">
                <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-lg border border-amber-400/40">
                  Verified Cover Image Preview
                </span>
              </div>
            )}
          </div>

          {/* 6. Featured Project Toggle (Officer Controlled) */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <strong className="block text-slate-900 dark:text-white font-heading">
                Feature on Homepage Showcase
              </strong>
              <span className="text-[11px] text-slate-500">
                {isOfficer ? 'Display this project prominently on the main homepage banner.' : 'Reserved for Club Executive Officers.'}
              </span>
            </div>

            <input
              type="checkbox"
              disabled={!isOfficer}
              checked={formData.isFeatured}
              onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-optimist-blue focus:ring-optimist-blue disabled:opacity-40"
            />
          </div>

          {/* Submission Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!currentUser}
              className="px-6 py-2.5 rounded-xl gold-gradient text-slate-950 font-extrabold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              Publish Post as {currentUser?.name || 'Member'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
