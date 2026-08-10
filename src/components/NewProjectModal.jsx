import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Upload, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

export const NewProjectModal = ({ isOpen, onClose }) => {
  const { currentUser, addProject } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Youth Empowerment',
    excerpt: '',
    content: '',
    impact: '',
    image: '',
    isFeatured: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle local image file upload preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      setError('Please fill in the project title, summary, and details.');
      return;
    }

    const result = addProject({
      ...formData,
      image: formData.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80'
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          title: '',
          category: 'Youth Empowerment',
          excerpt: '',
          content: '',
          impact: '',
          image: '',
          isFeatured: false
        });
        setImagePreview(null);
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gold-gradient text-slate-950 rounded-t-3xl">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-heading text-xl font-extrabold">
              Post New Project / Activity
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Project published successfully! Added to project showcase.
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Back to School Book Bag Drive 2025"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              >
                <option value="Youth Empowerment">Youth Empowerment</option>
                <option value="Community Outreach">Community Outreach</option>
                <option value="Education & Tech">Education & Tech</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Environment">Environment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Impact Highlight (Optional)
              </label>
              <input
                type="text"
                value={formData.impact}
                onChange={e => setFormData({ ...formData, impact: e.target.value })}
                placeholder="e.g. 100 Children Reached"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Short Summary / Excerpt *
            </label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief 1-2 sentence description of the project"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Full Project Details & Narrative *
            </label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Detailed description of what the project accomplished, location, partners, and key highlights..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-optimist-blue outline-none"
              required
            />
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Project Cover Photo
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="cursor-pointer w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-dashed border-slate-400 dark:border-slate-600 text-xs font-semibold flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-optimist-blue" />
                <span>Upload Photo File</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              <span className="text-xs text-slate-400">OR</span>

              <input
                type="url"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={e => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                placeholder="Paste Image URL (https://...)"
                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
              />
            </div>

            {imagePreview && (
              <div className="mt-3 relative h-36 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                  Cover Preview
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-optimist-gold" />
              Publish Post as {currentUser?.name || 'Member'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
