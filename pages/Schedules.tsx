import React from 'react';
import { Icons } from '../components/Icons';
import { useParish } from '../context/ParishContext';

const Schedules: React.FC = () => {
  const { schedules } = useParish();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-parish-blue mb-4">Mass Schedules</h1>
        <p className="text-gray-600">Join us in our celebration of the Holy Eucharist.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-parish-pink transition group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-parish-blue group-hover:bg-pink-50 group-hover:text-parish-pink transition">
                <Icons.Calendar size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-800">{schedule.day}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-2xl font-bold text-parish-blue">{schedule.time}</span>
              </div>
              <p className="text-gray-700 font-medium">{schedule.description}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 pt-2">
                <Icons.Church size={14} />
                <span>{schedule.location}</span>
              </div>
            </div>
          </div>
        ))}
        
        {schedules.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-gray-100 rounded-xl">
            No schedules posted yet.
          </div>
        )}
      </div>

      <div className="mt-16 bg-parish-silver rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Confession Schedule</h2>
        <p className="text-gray-600 mb-6">
          The Sacrament of Reconciliation is available every Wednesday after the Novena Mass 
          or by appointment at the Parish Office.
        </p>
        <button className="text-parish-blue font-medium hover:underline">Contact Office for Appointment</button>
      </div>
    </div>
  );
};

export default Schedules;