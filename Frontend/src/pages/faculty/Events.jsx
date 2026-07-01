import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Table, TableRow, TableCell } from "../../components/common/Table";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const FacultyEvents = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: events, setData: setEvents } = useApiResource(api.getEvents);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "workshop",
    maxParticipants: "",
  });

  const handleCreateEvent = async () => {
    if (
      eventForm.title &&
      eventForm.date &&
      eventForm.time &&
      eventForm.location
    ) {
      const newEvent = await api.createEvent({
        ...eventForm,
        maxParticipants: parseInt(eventForm.maxParticipants) || undefined,
        registeredCount: 0,
        status: "upcoming",
      });
      setEvents([...events, newEvent]);
      setEventForm({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        type: "workshop",
        maxParticipants: "",
      });
      setShowCreateModal(false);
      toast.success("Event created successfully");
    }
  };

  const initiateDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteConfirmModal(true);
  };

  const executeDeleteEvent = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteEvent(eventToDelete.id);
      setEvents(events.filter((e) => e.id !== eventToDelete.id));
      setShowDeleteConfirmModal(false);
      setEventToDelete(null);
      toast.success("Event deleted successfully");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-indigo-50/70 border-indigo-100 text-indigo-700";
      case "ongoing":
        return "bg-emerald-50/70 border-emerald-100 text-emerald-700";
      case "completed":
        return "bg-slate-50 border-slate-200 text-slate-705";
      case "cancelled":
        return "bg-rose-50/70 border-rose-100 text-rose-700";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "workshop":
        return "bg-indigo-50/70 border-indigo-100 text-indigo-700";
      case "seminar":
        return "bg-emerald-50/70 border-emerald-100 text-emerald-700";
      case "cultural":
        return "bg-violet-50/70 border-violet-100 text-violet-750";
      case "sports":
        return "bg-amber-50/70 border-amber-100 text-amber-750";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => e.status === "upcoming").length;
  const totalRegistrations = events.reduce(
    (sum, e) => sum + e.registeredCount,
    0
  );

  return (
    <div className="space-y-8 font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            Event Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage upcoming campus seminars, workshops, and activities
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-755 transition cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-650 border border-indigo-100/30">
              <Calendar className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Events</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{totalEvents}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/80 text-emerald-650 border border-emerald-100/30">
              <Calendar className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Upcoming Events</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{upcomingEvents}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50/80 text-violet-650 border border-violet-100/30">
              <Users className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Registrations</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">{totalRegistrations}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Events Table */}
      <Card title="Academic Events Catalog" subtitle="Scheduled workshops, cultural shows, and sports games">
        <Table headers={["Event", "Date & Time", "Location", "Type", "Registrations", "Status", "Actions"]}>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <div>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base">{event.title}</p>
                  <p className="text-xs text-slate-450 line-clamp-1 mt-0.5">{event.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs font-medium text-slate-500 space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{event.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize border ${getTypeColor(event.type)}`}>
                  {event.type}
                </span>
              </TableCell>
              <TableCell>
                <div className="text-xs font-medium text-slate-705 space-y-1">
                  <div>
                    <span className="font-bold text-slate-900">{event.registeredCount}</span>
                    {event.maxParticipants && <span className="text-slate-400">/{event.maxParticipants}</span>}
                  </div>
                  {event.maxParticipants && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${(event.registeredCount / event.maxParticipants) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize border ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition cursor-pointer">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => initiateDeleteEvent(event)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Event"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Description
            </label>
            <textarea
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
              rows={3}
              placeholder="Describe event curriculum or guidelines..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Date
              </label>
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Time
              </label>
              <input
                type="text"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
                placeholder="e.g. 10:00 AM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Location
              </label>
              <input
                type="text"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
                placeholder="e.g. Main Auditorium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Max Participants
              </label>
              <input
                type="number"
                value={eventForm.maxParticipants}
                onChange={(e) => setEventForm({ ...eventForm, maxParticipants: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
                placeholder="e.g. 100 (optional)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Event Type
            </label>
            <select
              value={eventForm.type}
              onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-905 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
            >
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="cultural">Cultural Show</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateEvent}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition text-xs font-semibold cursor-pointer shadow-md shadow-indigo-500/10"
            >
              Create Event
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setEventToDelete(null);
        }}
        onConfirm={executeDeleteEvent}
        title="Delete Event"
        message={`Are you sure you want to delete ${eventToDelete?.title}? This action cannot be undone and will remove all student event registrations.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FacultyEvents;
