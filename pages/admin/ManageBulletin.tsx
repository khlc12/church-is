import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../../components/Icons';
import { useParish } from '../../context/ParishContext';
import { Announcement } from '../../types';

const ManageBulletin: React.FC = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useParish();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialFormState = {
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    isPublic: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editId) {
      updateAnnouncement({ ...formData, id: editId });
    } else {
      addAnnouncement(formData);
    }
    resetForm();
  };

  const handleEdit = (item: Announcement) => {
    setFormData({
      title: item.title,
      content: item.content,
      date: item.date,
      imageUrl: item.imageUrl || '',
      isPublic: item.isPublic
    });
    setEditId(item.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement(id);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simple size validation (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please choose an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/dashboard" className="text-gray-500 hover:text-parish-blue">
          <Icons.Home size={20} />
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Manage Bulletin</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {isEditing ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Image</label>
                
                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-3 border border-gray-200 group">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-90 hover:opacity-100 shadow-sm transition-opacity"
                      title="Remove Image"
                    >
                      <Icons.X size={14} />
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                   {/* File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-parish-blue hover:bg-blue-50 transition text-gray-600 text-sm font-medium"
                    >
                      <Icons.Sparkles size={18} />
                      {formData.imageUrl ? 'Change Image' : 'Upload Image'}
                    </label>
                  </div>

                  <div className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold">OR</div>
                  
                  {/* URL Input Fallback */}
                  <input
                    type="url"
                    placeholder="Paste external image URL..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none text-sm"
                    value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg mt-3">
                   <p className="text-xs text-blue-800 font-medium mb-1">Image Guidelines:</p>
                   <ul className="text-xs text-blue-600 list-disc list-inside space-y-1">
                      <li>Recommended size: <strong>800x450px</strong> (Landscape) or <strong>800x800px</strong> (Square).</li>
                      <li>Maximum file size: 5MB.</li>
                      <li>Supported formats: JPG, PNG.</li>
                   </ul>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                  className="rounded text-parish-blue focus:ring-parish-blue w-4 h-4"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700 select-none">Publish immediately</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 bg-parish-pink text-white py-2 rounded-lg font-medium hover:bg-pink-600 transition shadow-sm"
                >
                  {isEditing ? 'Update Announcement' : 'Post Announcement'}
                </button>
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-6">
          {announcements.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col sm:flex-row group">
               {item.imageUrl && (
                 <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-100 relative overflow-hidden">
                   <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                   />
                 </div>
               )}
               
               <div className="p-5 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                     <p className="text-xs text-gray-500">{item.date}</p>
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Icons.FileText size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Icons.X size={18} />
                      </button>
                   </div>
                 </div>
                 
                 <p className="text-gray-600 text-sm mb-4 line-clamp-3 whitespace-pre-line">{item.content}</p>
                 
                 <div className="mt-auto flex items-center gap-2">
                   <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.isPublic ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                     {item.isPublic ? 'Published' : 'Draft'}
                   </span>
                   {!item.imageUrl && <span className="text-xs text-gray-400 italic">No image</span>}
                 </div>
               </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Icons.Bell size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No announcements yet</h3>
              <p className="text-gray-500">Create your first bulletin post to keep the community informed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBulletin;