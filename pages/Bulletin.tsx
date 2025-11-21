import React from 'react';
import { Icons } from '../components/Icons';
import { useParish } from '../context/ParishContext';

const Bulletin: React.FC = () => {
  const { announcements } = useParish();

  // Separate announcements into those with images (featured) and text-only
  const featured = announcements.filter(a => a.imageUrl && a.isPublic);
  const standard = announcements.filter(a => !a.imageUrl && a.isPublic);

  // Combine them so featured ones appear first if needed, or just map all.
  // Let's just map the raw list but render differently based on content.
  const visibleAnnouncements = announcements.filter(a => a.isPublic);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-parish-pink text-white p-3 rounded-xl">
          <Icons.Bell size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Parish Bulletin</h1>
          <p className="text-gray-500">Latest news and updates from Our Lady of Miraculous Medal.</p>
        </div>
      </div>

      <div className="space-y-8">
        {visibleAnnouncements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">No announcements at this time.</p>
          </div>
        )}

        {visibleAnnouncements.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
            {item.imageUrl && (
               <div className="h-48 sm:h-64 w-full overflow-hidden bg-gray-100">
                 <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                 />
               </div>
            )}
            
            <div className={`p-6 ${!item.imageUrl ? 'border-l-4 border-parish-blue' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                  {item.date}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{item.content}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-parish-blue">
                 <Icons.Church size={14} /> <span>Parish Office</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bulletin;