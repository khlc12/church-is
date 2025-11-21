import React, { useMemo } from 'react';
import { Icons } from '../components/Icons';
import { useParish } from '../context/ParishContext';

const Schedules: React.FC = () => {
  const { schedules, scheduleNote } = useParish();

  const grouped = useMemo(() => {
    const map = new Map<string, typeof schedules>();
    schedules.forEach((schedule) => {
      map.set(schedule.day, [...(map.get(schedule.day) ?? []), schedule]);
    });
    return Array.from(map.entries());
  }, [schedules]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-parish-blue mb-4">Mass Schedules</h1>
        <p className="text-gray-600">Join us in our celebration of the Holy Eucharist.</p>
      </div>

      {grouped.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-100 rounded-xl">
          No schedules posted yet.
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([day, entries]) => (
            <section key={day}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-parish-blue flex items-center justify-center">
                  <Icons.Calendar size={20} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">{day}</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {entries.map((schedule) => {
                  const highlight = schedule.description.toLowerCase();
                  const badge =
                    highlight.includes('family')
                      ? { label: 'Family', color: 'text-pink-600 bg-pink-50' }
                      : highlight.includes('youth')
                      ? { label: 'Youth', color: 'text-purple-600 bg-purple-50' }
                      : highlight.includes('choir')
                      ? { label: 'Choir', color: 'text-amber-600 bg-amber-50' }
                      : { label: 'Parish', color: 'text-parish-blue bg-blue-50' };
                  return (
                    <div
                      key={schedule.id}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-gray-900">{schedule.time}</span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
                      </div>
                      <p className="text-gray-600 mb-3">{schedule.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Icons.Church size={14} />
                        <span>{schedule.location}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-16 p-1 rounded-3xl bg-gradient-to-r from-parish-blue to-purple-800">
        <div className="bg-white/95 rounded-[22px] p-8 md:p-12 text-center shadow-xl bg-cover bg-center" style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url('/church-bg.jpg')"
        }}>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">{scheduleNote?.title ?? 'Confession Schedule'}</h2>
          <p className="text-gray-600 mb-6 whitespace-pre-line">
            {scheduleNote?.body ??
              'The Sacrament of Reconciliation is available every Wednesday after the Novena Mass or by appointment at the Parish Office.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-100">
              <Icons.Phone size={16} /> (055) 555-1234
            </button>
            <a
              href="mailto:parishoffice@example.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-100"
            >
              <Icons.Mail size={16} /> Email Parish Office
            </a>
          </div>
          {scheduleNote?.actionLabel ? (
            scheduleNote.actionLink ? (
              <a
                href={scheduleNote.actionLink}
                target={scheduleNote.actionLink.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-parish-blue text-white font-semibold shadow hover:bg-blue-800 mt-6"
              >
                <Icons.Church size={18} /> {scheduleNote.actionLabel}
              </a>
            ) : (
              <span className="text-parish-blue font-semibold mt-6 inline-flex items-center justify-center gap-2">
                <Icons.Church size={18} /> {scheduleNote.actionLabel}
              </span>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Schedules;
