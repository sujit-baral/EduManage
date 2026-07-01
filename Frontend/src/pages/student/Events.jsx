import React, { useState } from "react";
import { Calendar, MapPin, Clock, Users, Star } from "lucide-react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const StudentEvents = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { data: events, setData: setEvents } = useApiResource(api.getEvents);
  const { data: registrations, setData: setRegistrations } = useApiResource(
    api.getMyEventRegistrations
  );

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleRegistration = async () => {
    const updatedEvent = await api.registerEvent(selectedEvent.id);
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
    setRegistrations([
      ...registrations,
      { eventId: selectedEvent.id, id: selectedEvent.id },
    ]);
    setShowRegistrationModal(false);
    toast.success("Event registered successfully");
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "workshop":
        return "bg-indigo-50/70 border border-indigo-100 text-indigo-750";
      case "seminar":
        return "bg-emerald-50/70 border border-emerald-100 text-emerald-750";
      case "cultural":
        return "bg-violet-50/70 border border-violet-100 text-violet-750";
      case "sports":
        return "bg-amber-50/70 border border-amber-100 text-amber-750";
      default:
        return "bg-slate-50 border border-slate-200 text-slate-700";
    }
  };

  const registeredEvents = registrations.map((registration) => registration.eventId);

  const isEventFull = (event) => {
    return (
      event.maxParticipants && event.registeredCount >= event.maxParticipants
    );
  };

  return (
    <div className="space-y-8 font-sans antialiased">
      {/* Title section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
          Events & Workshops
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Discover learning opportunities and register for upcoming campus events
        </p>
      </div>

      {/*------------------------------------------- Stats ----------------------------------------*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-650 border border-indigo-100/30">
              <Calendar className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Events</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {events.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/80 text-emerald-650 border border-emerald-100/30">
              <Star className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Registered</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {registeredEvents.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50/80 text-violet-650 border border-violet-100/30">
              <Users className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Workshops</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {events.filter((e) => e.type === "workshop").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50/80 text-amber-650 border border-amber-100/30">
              <Clock className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">This Month</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {
                  events.filter(
                    (e) => new Date(e.date).getMonth() === new Date().getMonth()
                  ).length
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/*------------------------------------- Events Grid -----------------------------------------*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const isRegistered = registeredEvents.includes(event.id);
          const isFull = isEventFull(event);
          const progressPercent = event.maxParticipants
            ? Math.round((event.registeredCount / event.maxParticipants) * 100)
            : 0;

          return (
            <Card key={event.id} className="h-full flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2.5">
                  <h3 className="text-lg font-semibold text-slate-900 font-display leading-snug">
                    {event.title}
                  </h3>
                  <span
                    className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize shrink-0 ${getEventTypeColor(
                      event.type
                    )}`}
                  >
                    {event.type}
                  </span>
                </div>

                <p className="text-slate-500 text-xs font-normal leading-relaxed line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <div className="flex items-center text-xs font-medium text-slate-600">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </div>
                  <div className="flex items-center text-xs font-medium text-slate-600">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-xs font-medium text-slate-600">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{event.location}</span>
                  </div>
                  {event.maxParticipants && (
                    <div className="flex items-center text-xs font-medium text-slate-600">
                      <Users className="h-4 w-4 mr-2 text-slate-400" />
                      <span>
                        {event.registeredCount} / {event.maxParticipants} slots reserved
                      </span>
                    </div>
                  )}
                </div>

                {event.maxParticipants && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Registration Progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-650 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                {isRegistered ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5 text-xs font-semibold"
                  >
                    <Star className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                    <span>Registered</span>
                  </button>
                ) : isFull ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-slate-100 text-slate-450 border border-slate-200 rounded-xl cursor-not-allowed text-xs font-semibold"
                  >
                    Event Full
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegisterClick(event)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition font-semibold text-xs cursor-pointer shadow-md shadow-indigo-500/10"
                  >
                    Register Now
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* -------------------------------Registration Modal-------------------------------- */}
      <Modal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        title="Event Registration"
      >
        <div className="space-y-5">
          <div className="space-y-1.5 bg-slate-50 p-4 border border-slate-150 rounded-xl">
            <h4 className="font-semibold text-slate-900 text-base leading-snug">
              {selectedEvent?.title}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {selectedEvent?.description}
            </p>
          </div>

          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center text-xs font-medium text-slate-600">
              <Calendar className="h-4.5 w-4.5 mr-2 text-slate-400" />
              <span>
                {selectedEvent &&
                  new Date(selectedEvent.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
              </span>
            </div>
            <div className="flex items-center text-xs font-medium text-slate-600">
              <Clock className="h-4.5 w-4.5 mr-2 text-slate-400" />
              <span>{selectedEvent?.time}</span>
            </div>
            <div className="flex items-center text-xs font-medium text-slate-600">
              <MapPin className="h-4.5 w-4.5 mr-2 text-slate-400" />
              <span>{selectedEvent?.location}</span>
            </div>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-150 rounded-xl p-4">
            <p className="text-xs leading-relaxed text-indigo-950 font-medium">
              <strong>Notice:</strong> By confirming registration, your slot will be secured. Please check your schedule to avoid conflicts.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowRegistrationModal(false)}
              className="px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleRegistration}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition text-xs font-semibold cursor-pointer"
            >
              Confirm Registration
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentEvents;
