import React from 'react';
import { Icons } from '../components/Icons';
import { useParish } from '../context/ParishContext';

const Donations: React.FC = () => {
  const { donations } = useParish();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gradient-to-br from-pink-600 to-rose-900 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/20 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
            <Icons.Heart size={32} />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Our Generous Donors</h1>
          <p className="text-lg text-pink-100 max-w-2xl mx-auto">
            "God loves a cheerful giver." (2 Corinthians 9:7). <br/>
            We extend our heartfelt gratitude to everyone who supports the mission and projects of our parish.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Icons.Sparkles className="text-yellow-500" size={20} />
              Recent Contributions
            </h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {donations.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No donation records available at this time.
              </div>
            )}

            {donations.map((donation) => (
              <div key={donation.id} className="p-6 hover:bg-gray-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${donation.isAnonymous ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-parish-blue'}`}>
                      {donation.isAnonymous ? <Icons.Shield size={20} /> : <Icons.Users size={20} />}
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-gray-900">
                       {donation.isAnonymous ? 'Anonymous Donor' : donation.donorName}
                     </h3>
                     <p className="text-gray-500 text-sm">{donation.purpose}</p>
                     <p className="text-xs text-gray-400 mt-1">{donation.date}</p>
                   </div>
                </div>
                <div className="bg-green-50 text-green-700 font-medium px-4 py-2 rounded-full self-start sm:self-center whitespace-nowrap border border-green-100">
                  {donation.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-parish-blue text-white rounded-2xl p-8">
            <h3 className="text-2xl font-serif font-bold mb-4">Ways to Give</h3>
            <p className="mb-6 text-blue-100">
              Your support helps us maintain our church, run our programs, and help the poor. 
              You can offer your donations through:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-parish-pink"></div>
                <span>Mass Offerings & Collections</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-parish-pink"></div>
                <span>Parish Office (In-person)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-parish-pink"></div>
                <span>Bank Transfer (Details below)</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Bank Details</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">BDO Account</p>
                <p className="font-mono text-lg text-gray-800">0012-3456-7890</p>
                <p className="text-sm text-gray-600">Quasi-Parish of Our Lady of Miraculous Medal</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">GCash</p>
                <p className="font-mono text-lg text-gray-800">0917-123-4567</p>
                <p className="text-sm text-gray-600">Parish Finance Council</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;