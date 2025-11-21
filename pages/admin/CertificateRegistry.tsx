import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../../components/Icons';
import { useParish } from '../../context/ParishContext';
import { CertificateStatus, IssuedCertificate } from '../../types';
import { formatDate } from '../../utils/date';

const CertificateRegistry: React.FC = () => {
  const { issuedCertificates, uploadCertificateFile, downloadCertificateFile } = useParish();
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadTarget, setUploadTarget] = useState<IssuedCertificate | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const filteredCertificates = issuedCertificates.filter((cert) =>
    [cert.recipientName, cert.requesterName, cert.type]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const pendingUploads = issuedCertificates.filter((cert) => cert.status === CertificateStatus.PENDING_UPLOAD).length;
  const completedUploads = issuedCertificates.filter((cert) => cert.status === CertificateStatus.UPLOADED).length;
  const remindersDue = issuedCertificates.filter((cert) => cert.needsUploadReminder).length;

  const openUploadModal = (certificate: IssuedCertificate) => {
    setUploadTarget(certificate);
    setSelectedFile(null);
    setUploadError('');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTarget || !selectedFile) {
      setUploadError('Please choose a PDF, JPG, or PNG file to upload.');
      return;
    }
    try {
      setIsUploading(true);
      await uploadCertificateFile(uploadTarget.id, selectedFile);
      setUploadTarget(null);
      setSelectedFile(null);
    } catch (err) {
      setUploadError('Unable to upload the certificate. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (certificate: IssuedCertificate) => {
    setDownloadError('');
    try {
      const { blob, filename } = await downloadCertificateFile(certificate.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError('Unable to download certificate. Please try again later.');
    }
  };

  const statusBadge = (cert: IssuedCertificate) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1';
    if (cert.status === CertificateStatus.UPLOADED) {
      return (
        <span className={`${base} bg-green-100 text-green-800`}>
          <Icons.CheckCircle size={14} /> Uploaded
        </span>
      );
    }
    return (
      <span className={`${base} bg-amber-100 text-amber-800`}>
        <Icons.UploadCloud size={14} /> Pending Upload
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/dashboard" className="text-gray-500 hover:text-parish-blue">
          <Icons.Home size={20} />
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Certificate Registry</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
            <Icons.UploadCloud size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Uploads</p>
            <p className="text-2xl font-bold">{pendingUploads}</p>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <Icons.FileCheck size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed Uploads</p>
            <p className="text-2xl font-bold">{completedUploads}</p>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-full">
            <Icons.AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Reminders Needed</p>
            <p className="text-2xl font-bold">{remindersDue}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by recipient, requester, or type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-parish-blue focus:border-parish-blue outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {downloadError && (
            <div className="text-sm text-red-600 flex items-center gap-2">
              <Icons.AlertTriangle size={16} /> {downloadError}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Certificate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Recipient</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Issuance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Upload Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{cert.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{cert.type}</div>
                    <div className="text-xs text-gray-500">Requested by {cert.requesterName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{cert.recipientName}</div>
                    {cert.needsUploadReminder && (
                      <div className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                        <Icons.AlertTriangle size={14} /> Upload overdue
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>Issued: {formatDate(cert.dateIssued)}</div>
                    {cert.uploadedAt && (
                      <div className="text-xs text-gray-500">
                        Uploaded: {formatDate(cert.uploadedAt)} {cert.uploadedBy && `by ${cert.uploadedBy}`}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 space-y-2">
                    {statusBadge(cert)}
                    {cert.notes && (
                      <div className="text-xs text-gray-500 italic truncate max-w-[160px]" title={cert.notes}>
                        {cert.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-y-2">
                    {cert.status === CertificateStatus.PENDING_UPLOAD ? (
                      <button
                        onClick={() => openUploadModal(cert)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition text-xs"
                      >
                        <Icons.UploadCloud size={14} /> Upload File
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDownload(cert)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-parish-blue text-white hover:bg-blue-800 transition text-xs"
                      >
                        <Icons.Download size={14} /> Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCertificates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No certificates found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {uploadTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Upload Certificate File</h2>
              <button onClick={() => setUploadTarget(null)} className="text-gray-400 hover:text-gray-600">
                <Icons.X size={24} />
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mb-4">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <Icons.AlertTriangle size={16} /> Upload Required
              </p>
              <p>
                The issued certificate for <strong>{uploadTarget.recipientName}</strong> must be uploaded
                before it can be viewed or downloaded.
              </p>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
              {uploadError && (
                <div className="text-sm text-red-600 flex items-center gap-2">
                  <Icons.AlertTriangle size={16} /> {uploadError}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="flex-1 bg-parish-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? 'Uploading...' : <><Icons.UploadCloud size={16} /> Upload</>}
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTarget(null)}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
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

export default CertificateRegistry;
