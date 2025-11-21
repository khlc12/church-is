import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_RECORDS } from '../constants';
import { Icons } from '../components/Icons';
import { useParish } from '../context/ParishContext';

const AdminDashboard: React.FC = () => {
  const { announcements, donations, requests, issuedCertificates } = useParish();

  const pendingRequests = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Parish Administrator Dashboard</h1>
        <p className="text-gray-500">Overview of records and operations.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Link to="/admin/manage-requests" className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-orange-500 transition group relative">
           <div className="bg-orange-50 text-orange-600 w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-orange-600 group-hover:text-white transition">
             <Icons.FileQuestion size={20} />
           </div>
           <h3 className="font-bold text-gray-800">Service Requests</h3>
           <p className="text-xs text-gray-500">Manage applications</p>
           {pendingRequests > 0 && (
             <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
               {pendingRequests}
             </span>
           )}
        </Link>

        <Link to="/admin/registry" className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-teal-500 transition group">
           <div className="bg-teal-50 text-teal-600 w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-teal-600 group-hover:text-white transition">
             <Icons.FileCheck size={20} />
           </div>
           <h3 className="font-bold text-gray-800">Cert. Registry</h3>
           <p className="text-xs text-gray-500">Issued certificates</p>
        </Link>

        <Link to="/admin/manage-schedules" className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-parish-blue transition group">
           <div className="bg-blue-50 text-parish-blue w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-parish-blue group-hover:text-white transition">
             <Icons.Calendar size={20} />
           </div>
           <h3 className="font-bold text-gray-800">Manage Schedules</h3>
           <p className="text-xs text-gray-500">Update mass times</p>
        </Link>
        
        <Link to="/admin/manage-bulletin" className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-parish-pink transition group">
           <div className="bg-pink-50 text-parish-pink w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-parish-pink group-hover:text-white transition">
             <Icons.Bell size={20} />
           </div>
           <h3 className="font-bold text-gray-800">Manage Bulletin</h3>
           <p className="text-xs text-gray-500">Post announcements</p>
        </Link>

        <Link to="/admin/manage-donations" className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-rose-500 transition group">
           <div className="bg-rose-50 text-rose-600 w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-rose-600 group-hover:text-white transition">
             <Icons.Heart size={20} />
           </div>
           <h3 className="font-bold text-gray-800">Manage Donations</h3>
           <p className="text-xs text-gray-500">Record contributions</p>
        </Link>

        <Link to="/admin/records" className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-purple-500 transition group">
           <div className="bg-purple-50 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-600 group-hover:text-white transition">
             <Icons.BookOpen size={20} />
           </div>
           <h3 className="font-bold text-gray-800">Records</h3>
           <p className="text-xs text-gray-500">View Sacraments</p>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Pending Requests</h3>
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Icons.FileQuestion size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingRequests}</p>
          <span className="text-xs text-gray-500">Requires action</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Issued Certs</h3>
            <div className="bg-teal-100 p-2 rounded-lg text-teal-600"><Icons.FileCheck size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{issuedCertificates.length}</p>
          <span className="text-xs text-gray-500">Total archived</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Donations</h3>
            <div className="bg-rose-100 p-2 rounded-lg text-rose-600"><Icons.Heart size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{donations.length}</p>
          <span className="text-xs text-gray-500">Recorded entries</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Sacraments</h3>
            <div className="bg-blue-100 p-2 rounded-lg text-parish-blue"><Icons.BookOpen size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{MOCK_RECORDS.length}</p>
          <span className="text-xs text-gray-500">Historic records</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;