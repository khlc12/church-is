import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../../components/Icons';
import { useParish } from '../../context/ParishContext';
import { IssuedCertificate } from '../../types';

const CertificateRegistry: React.FC = () => {
  const { issuedCertificates } = useParish();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewCertificate, setViewCertificate] = useState<IssuedCertificate | null>(null);

  const filteredCertificates = issuedCertificates.filter(cert => 
    cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple Digital Copy Viewer
  const DigitalCertificateView = ({ cert }: { cert: IssuedCertificate }) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl min-h-[600px] p-8 md:p-12 relative shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col">
        <button 
          onClick={() => setViewCertificate(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <Icons.X size={32} />
        </button>

        <div className="border-4 border-double border-gray-800 h-full p-8 flex-1 flex flex-col items-center text-center bg-[#fffbf0]">
           {/* Header */}
           <div className="mb-8">
             <h1 className="text-3xl font-serif font-bold text-gray-900 uppercase tracking-widest mb-2">Certificate of {cert.type.replace(' Certificate', '')}</h1>
             <p className="text-gray-600 italic">Quasi-Parish of Our Lady of Miraculous Medal</p>
             <p className="text-sm text-gray-500">Sabang Borongan</p>
           </div>

           {/* Body */}
           <div className="flex-1 flex flex-col justify-center w-full max-w-2xl space-y-6">
             <p className="text-lg text-gray-700">This is to certify that</p>
             <h2 className="text-4xl font-serif font-bold text-parish-blue border-b-2 border-gray-300 pb-2">{cert.recipientName}</h2>
             <p className="text-gray-700">has requested and is hereby issued this record for the purpose of verification.</p>
             
             <div className="grid grid-cols-2 gap-8 text-left mt-8 bg-white/50 p-6 border border-gray-200 rounded-lg">
               <div>
                 <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Date Issued</p>
                 <p className="text-lg font-mono">{cert.dateIssued}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Issued By</p>
                 <p className="text-lg">{cert.issuedBy}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Reference ID</p>
                 <p className="text-lg font-mono">{cert.id}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Notes</p>
                 <p className="text-sm italic">{cert.notes || 'N/A'}</p>
               </div>
             </div>
           </div>

           {/* Footer */}
           <div className="mt-12 w-full flex justify-between items-end">
             <div className="text-center">
               <div className="w-32 border-b border-gray-800 mb-2"></div>
               <p className="text-xs uppercase">Parish Seal</p>
             </div>
             <div className="text-center">
               <p className="font-serif font-bold text-lg">{cert.issuedBy}</p>
               <div className="w-48 border-b border-gray-800 mb-2"></div>
               <p className="text-xs uppercase">Authorized Signatory</p>
             </div>
           </div>
        </div>

        <div className="mt-6 flex justify-center gap-4 print:hidden">
          <button 
             onClick={() => window.print()}
             className="bg-gray-900 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800"
          >
            <Icons.Printer size={18} /> Print Copy
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/dashboard" className="text-gray-500 hover:text-parish-blue">
          <Icons.Home size={20} />
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Certificate Registry</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Stats / Info */}
        <div className="p-6 bg-gradient-to-r from-teal-500 to-teal-700 text-white">
           <div className="flex items-center gap-4">
             <div className="bg-white/20 p-3 rounded-xl">
               <Icons.Archive size={32} />
             </div>
             <div>
               <h2 className="text-xl font-bold">Archived Issuances</h2>
               <p className="text-teal-100">Secure log of all certificates issued by the parish office.</p>
             </div>
           </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-lg w-full">
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search registry..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="text-teal-700 font-medium text-sm flex items-center gap-2 hover:text-teal-900">
            <Icons.Printer size={16} /> Generate Monthly Report
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-teal-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500">
                    #{cert.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full font-medium">
                      {cert.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{cert.recipientName}</div>
                    <div className="text-xs text-gray-500">Req: {cert.requesterName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {cert.issuedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cert.dateIssued}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setViewCertificate(cert)}
                      className="text-teal-600 hover:text-teal-900 flex items-center justify-end gap-1 w-full"
                    >
                      <Icons.FileText size={16} /> View Copy
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCertificates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No records found in the registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Certificate Modal */}
      {viewCertificate && <DigitalCertificateView cert={viewCertificate} />}
    </div>
  );
};

export default CertificateRegistry;