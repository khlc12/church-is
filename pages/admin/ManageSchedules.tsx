import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../../components/Icons';
import { useParish } from '../../context/ParishContext';
import { MassSchedule } from '../../types';
import { useDialog } from '../../context/DialogContext';

const ManageSchedules: React.FC = () => {
  const { schedules, scheduleNote, addSchedule, updateSchedule, deleteSchedule, saveScheduleNote } = useParish();
  const { alert, confirm } = useDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const initialFormState = {
    day: '',
    time: '',
    description: '',
    location: 'Main Church'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [noteForm, setNoteForm] = useState({
    title: scheduleNote?.title ?? 'Confession Schedule',
    body:
      scheduleNote?.body ??
      'The Sacrament of Reconciliation is available every Wednesday after the Novena Mass or by appointment at the Parish Office.',
    actionLabel: scheduleNote?.actionLabel ?? 'Contact Office for Appointment',
    actionLink: scheduleNote?.actionLink ?? ''
  });
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    setNoteForm({
      title: scheduleNote?.title ?? 'Confession Schedule',
      body:
        scheduleNote?.body ??
        'The Sacrament of Reconciliation is available every Wednesday after the Novena Mass or by appointment at the Parish Office.',
      actionLabel: scheduleNote?.actionLabel ?? 'Contact Office for Appointment',
      actionLink: scheduleNote?.actionLink ?? ''
    });
  }, [scheduleNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        await updateSchedule({ ...formData, id: editId });
      } else {
        await addSchedule(formData);
      }
      resetForm();
    } catch (error) {
      await alert({
        title: 'Unable to save schedule',
        message: 'Please try again in a moment.'
      });
    }
  };

  const handleEdit = (schedule: MassSchedule) => {
    setFormData({
      day: schedule.day,
      time: schedule.time,
      description: schedule.description,
      location: schedule.location
    });
    setEditId(schedule.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const shouldDelete = await confirm({
      title: 'Delete schedule?',
      message: 'This schedule will be removed from the public list.',
      confirmText: 'Delete Schedule',
      destructive: true
    });
    if (!shouldDelete) return;
    try {
      await deleteSchedule(id);
    } catch (error) {
      await alert({
        title: 'Unable to delete schedule',
        message: 'Please try again later.'
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingNote(true);
      await saveScheduleNote({
        title: noteForm.title,
        body: noteForm.body,
        actionLabel: noteForm.actionLabel?.trim() ? noteForm.actionLabel : undefined,
        actionLink: noteForm.actionLink?.trim() ? noteForm.actionLink : undefined
      });
      await alert({
        title: 'Schedule info updated',
        message: 'The Mass & Events highlight section has been refreshed.'
      });
    } catch (error) {
      await alert({
        title: 'Unable to save section',
        message: 'Please try again later.'
      });
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/dashboard" className="text-gray-500 hover:text-parish-blue">
          <Icons.Home size={20} />
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Manage Schedules</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {isEditing ? 'Edit Schedule' : 'Add New Schedule'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <input
                  type="text"
                  placeholder="e.g. Sunday, First Friday"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="text"
                  placeholder="e.g. 08:30 AM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. English Mass"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 bg-parish-blue text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition"
                >
                  {isEditing ? 'Update' : 'Add Schedule'}
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
        <div className="lg:col-span-2 space-y-4">
          {schedules.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="font-bold text-lg text-gray-800">{item.day}</span>
                   <span className="text-xs bg-blue-50 text-parish-blue px-2 py-1 rounded-full font-mono">{item.time}</span>
                 </div>
                 <p className="text-gray-600">{item.description}</p>
                 <p className="text-xs text-gray-400 mt-1">{item.location}</p>
              </div>
              <div className="flex gap-2 self-end sm:self-center">
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
          ))}

          {schedules.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No schedules found. Add one to get started.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Mass & Events Highlight</h2>
          <form onSubmit={handleSaveNote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-parish-blue focus:border-parish-blue outline-none"
                value={noteForm.title}
                onChange={(e) => setNoteForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-parish-blue focus:border-parish-blue outline-none"
                rows={4}
                value={noteForm.body}
                onChange={(e) => setNoteForm((prev) => ({ ...prev, body: e.target.value }))}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Label</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-parish-blue focus:border-parish-blue outline-none"
                  value={noteForm.actionLabel}
                  onChange={(e) => setNoteForm((prev) => ({ ...prev, actionLabel: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Link</label>
                <input
                  type="url"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-parish-blue focus:border-parish-blue outline-none"
                  placeholder="mailto: or https://"
                  value={noteForm.actionLink}
                  onChange={(e) => setNoteForm((prev) => ({ ...prev, actionLink: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingNote}
                className="px-5 py-2 rounded-lg bg-parish-blue text-white font-medium hover:bg-blue-800 disabled:opacity-60"
              >
                {isSavingNote ? 'Saving...' : 'Save Section'}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-parish-silver rounded-2xl p-6 md:p-8">
          <h3 className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Preview</h3>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[220px] flex flex-col">
            <h4 className="text-2xl font-serif font-bold text-gray-900 mb-3">{noteForm.title}</h4>
            <p className="text-gray-600 flex-1 whitespace-pre-line">{noteForm.body}</p>
            {noteForm.actionLabel && (
              <span className="mt-4 inline-flex items-center justify-center gap-2 text-parish-blue font-semibold">
                <Icons.Church size={16} /> {noteForm.actionLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSchedules;
