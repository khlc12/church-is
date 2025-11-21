import React, { useState } from 'react';
import { useParish } from '../context/ParishContext';
import { SacramentType, SacramentRecord } from '../types';
import { Icons } from '../components/Icons';

const Records: React.FC = () => {
  const { records, addRecord, updateRecord, deleteRecord } = useParish();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const initialFormState = {
    name: '',
    date: new Date().toISOString().split('T')[0],
    type: SacramentType.BAPTISM,
    officiant: '',
    details: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || record.type === filterType;
    return matchesSearch && matchesType;
  });

  const getBadgeColor = (type: SacramentType) => {
    switch (type) {
      case SacramentType.BAPTISM: return 'bg-blue-100 text-blue-800';
      case SacramentType.MARRIAGE: return 'bg-pink-100 text-pink-800';
      case SacramentType.CONFIRMATION: return 'bg-purple-100 text-purple-800';
      case SacramentType.FUNERAL: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenModal = (record?: SacramentRecord) => {
    if (record) {
      setIsEditing(true);
      setEditId(record.id);
      setFormData({
        name: record.name,
        date: record.date,
        type: record.type,
        officiant: record.officiant,
        details: record.details
      });
    } else {
      setIsEditing(false);
      setEditId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editId) {
      updateRecord({ ...formData, id: editId });
    } else {
      addRecord(formData);
    }
    handleCloseModal();
  };

  const handleArchive = (id: string) => {
    if (window.confirm('Are you sure you want to archive/delete this record?')) {
      deleteRecord(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
           <LinkWrapper to="/admin/dashboard">
              <div className="p-2 bg-white rounded-lg border border-gray-200 hover:border-parish-blue text-gray-500 hover:text-parish-blue transition">
                <Icons.Home size={20} />
              </div>
           </LinkWrapper>
           <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Sacramental Records</h1>
            <p className="text-gray-500 text-sm">Manage baptism, confirmation, and marriage entries.</p>
           </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-parish-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition"
        >
          <Icons.Plus size={18} /> Add Record
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 bg-gray-50">
          <div className="relative flex-1">
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-parish-blue focus:border-parish-blue outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Sacraments</option>
            {Object.values(SacramentType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sacrament</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officiant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{record.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{record.details}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(record.type)}`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.officiant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleOpenModal(record)}
                      className="text-parish-blue hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleArchive(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-gray-800">
                 {isEditing ? 'Edit Record' : 'New Sacramental Record'}
               </h2>
               <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                 <Icons.X size={24} />
               </button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Sacrament Type</label>
                 <select
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                   value={formData.type}
                   onChange={(e) => setFormData({...formData, type: e.target.value as SacramentType})}
                 >
                   {Object.values(SacramentType).map(type => (
                     <option key={type} value={type}>{type}</option>
                   ))}
                 </select>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                 <input 
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Full Name"
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                   <input 
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Officiant</label>
                   <input 
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                      value={formData.officiant}
                      onChange={(e) => setFormData({...formData, officiant: e.target.value})}
                      required
                      placeholder="e.g. Fr. Juan"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Details (Parents, Sponsors, etc.)</label>
                 <textarea 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-parish-blue outline-none"
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    placeholder="Additional information..."
                 />
               </div>

               <div className="pt-4 flex gap-3">
                 <button 
                   type="submit" 
                   className="flex-1 bg-parish-blue text-white py-2.5 rounded-lg font-bold hover:bg-blue-800 transition"
                 >
                   {isEditing ? 'Save Changes' : 'Create Record'}
                 </button>
                 <button 
                   type="button"
                   onClick={handleCloseModal} 
                   className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition"
                 >
                   Cancel
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for conditional Link usage if needed, but standard Link is fine
import { Link } from 'react-router-dom';
const LinkWrapper: React.FC<{to: string, children: React.ReactNode}> = ({to, children}) => <Link to={to}>{children}</Link>;

export default Records;