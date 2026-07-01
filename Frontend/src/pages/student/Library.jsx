import React, { useState } from "react";
import {
  Book,
  Search,
  Filter,
  Calendar,
  Clock,
  Download,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const StudentLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const {
    data: library,
    setData: setLibrary,
    refresh: refreshLibrary,
  } = useApiResource(api.getLibraryOverview, {
    books: [],
    borrowedBooks: [],
    digitalResources: [],
  });

  const libraryBooks = library.books || [];
  const borrowedBooks = library.borrowedBooks || [];
  const digitalResources = library.digitalResources || [];

  const categories = ["all", ...new Set(libraryBooks.map((book) => book.category))];

  const filteredBooks = libraryBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReserveBook = (book) => {
    setSelectedBook(book);
    setShowReserveModal(true);
  };

  const handleConfirmReservation = async () => {
    const { book, reservation } = await api.reserveBook(selectedBook.id);
    setLibrary({
      ...library,
      books: libraryBooks.map((item) => (item.id === book.id ? book : item)),
      borrowedBooks: [...borrowedBooks, reservation],
    });
    setShowReserveModal(false);
    setSelectedBook(null);
    toast.success("Book reserved successfully");
  };

  const handleRenewLoan = async (loanId) => {
    const updatedLoan = await api.renewLoan(loanId);
    setLibrary({
      ...library,
      borrowedBooks: borrowedBooks.map((loan) =>
        loan.id === updatedLoan.id ? updatedLoan : loan
      ),
    });
    toast.success("Book renewed successfully");
  };

  const handleReturnLoan = async (loanId) => {
    await api.returnLoan(loanId);
    await refreshLibrary();
    toast.success("Book returned successfully");
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100/50";
      case "issued":
        return "bg-amber-50 text-amber-700 border border-amber-100/50";
      case "reserved":
        return "bg-blue-50 text-blue-700 border border-blue-100/50";
      default:
        return "bg-slate-50 border border-slate-200 text-slate-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100/40";
      case "overdue":
        return "bg-rose-50 text-rose-700 border border-rose-100/40";
      case "returned":
        return "bg-slate-50 border border-slate-200 text-slate-600";
      default:
        return "bg-slate-50 border border-slate-200 text-slate-600";
    }
  };

  const totalBorrowed = borrowedBooks.filter(
    (book) => ["active", "overdue"].includes(book.status)
  ).length;
  const overdueBooksCount = borrowedBooks.filter(
    (book) => book.status === "overdue"
  ).length;
  const availableBooksCount = libraryBooks.filter(
    (book) => book.availability === "available"
  ).length;
  const reservedBooksCount = libraryBooks.filter(
    (book) => book.availability === "reserved"
  ).length;

  const selectClass =
    "px-3.5 py-2 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition cursor-pointer";

  return (
    <div className="space-y-8 font-sans antialiased">
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
          Library Management
        </h1>
        <p className="text-sm text-slate-500 font-medium font-sans">
          Browse resource catalogue, track active loans, and access online databases
        </p>
      </div>

      {/*------------------------------------------ Stats ----------------------------------------------*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-650 border border-indigo-100/30">
              <BookOpen className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Books Borrowed</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {totalBorrowed}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50/80 text-rose-650 border border-rose-100/30">
              <Clock className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overdue Loans</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {overdueBooksCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/80 text-emerald-650 border border-emerald-100/30">
              <Book className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Available Books</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {availableBooksCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-0.5 transition duration-200">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50/80 text-blue-655 border border-blue-100/30">
              <Calendar className="h-5.5 w-5.5" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Reserved</p>
              <p className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {reservedBooksCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* -----------------------------------Book Search and Catalog ----------------------------------*/}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Book Catalog" subtitle="Search and reserve physical books">
            {/*-------------------------------- Search and Filter --------------------------------------*/}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                <input
                  type="text"
                  placeholder="Search books by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2.5 rounded-lg border border-slate-250 bg-white/70 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/25 transition"
                />
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Filter className="h-4.5 w-4.5 text-slate-450" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={selectClass}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/*------------------------------------ Books Grid ----------------------------------------*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col justify-between border border-slate-200/60 bg-slate-50/30 hover:bg-white hover:shadow-md hover:border-slate-350/40 rounded-2xl p-5 transition duration-200 space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2.5">
                      <h3 className="font-semibold text-slate-900 font-display text-sm leading-snug line-clamp-2">
                        {book.title}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-0.5 text-xxs font-medium rounded-full capitalize shrink-0 ${getAvailabilityColor(
                          book.availability
                        )}`}
                      >
                        {book.availability}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-slate-500">
                        by {book.author}
                      </p>
                      <p className="text-xxs text-slate-400 font-medium">ISBN: {book.isbn}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                    <span className="inline-flex text-xxs bg-slate-100 border border-slate-200/50 text-slate-600 font-medium px-2 py-0.5 rounded">
                      {book.category}
                    </span>

                    <div className="shrink-0">
                      {book.availability === "available" && (
                        <button
                          onClick={() => handleReserveBook(book)}
                          className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-755 text-white text-xs font-medium rounded-xl transition cursor-pointer"
                        >
                          Reserve
                        </button>
                      )}
                      {book.availability === "issued" && book.dueDate && (
                        <div className="text-xxs font-medium text-slate-450">
                          Due: {new Date(book.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/*--------------------------------------- My Books & Resources -------------------------------------*/}
        <div className="space-y-6">
          <Card title="Borrowed Books" subtitle="Track your library loans">
            <div className="space-y-4">
              {borrowedBooks.map((book) => (
                <div
                  key={book.id}
                  className="border border-slate-200/60 bg-slate-50/30 rounded-2xl p-4.5 space-y-3"
                >
                  <div className="flex justify-between items-start gap-2.5">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-slate-900 text-sm leading-snug">
                        {book.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">{book.author}</p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 text-xxs font-medium rounded-full capitalize shrink-0 ${getStatusColor(
                        book.status
                      )}`}
                    >
                      {book.status}
                    </span>
                  </div>

                  <div className="text-xxs font-medium text-slate-505 space-y-1">
                    <p>
                      Issued: {new Date(book.issueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                    <p>Due: {new Date(book.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                    {book.status === "overdue" && (
                      <p className="text-rose-600 font-medium">
                        Overdue by{" "}
                        {Math.ceil(
                          (Date.now() - new Date(book.dueDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </p>
                    )}
                  </div>

                  {["active", "overdue"].includes(book.status) && (
                    <div className="flex gap-2 pt-1.5 border-t border-slate-100/50">
                      <button
                        onClick={() => handleRenewLoan(book.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl transition cursor-pointer"
                      >
                        Renew
                      </button>
                      <button
                        onClick={() => handleReturnLoan(book.id)}
                        className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl transition cursor-pointer"
                      >
                        Return
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {borrowedBooks.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <Book className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                  <p className="text-xs font-medium">No borrowed books found</p>
                </div>
              )}
            </div>
          </Card>

          {/*--------------------------------------- Digital Resources ------------------------------------*/}
          <Card title="Digital Databases" subtitle="Access global online repositories">
            <div className="space-y-3">
              {digitalResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition duration-200"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-900 text-xs leading-snug">{resource.name}</p>
                    <p className="text-xxs text-slate-450 font-medium uppercase tracking-wider">{resource.type}</p>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-xl transition cursor-pointer"
                  >
                    <span>Access</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ----------------------------------Reservation Modal --------------------------------------*/}
      <Modal
        isOpen={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        title="Reserve Book"
      >
        <div className="space-y-5">
          {selectedBook && (
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-1">
              <h4 className="font-semibold text-slate-900 text-base leading-snug">
                {selectedBook.title}
              </h4>
              <p className="text-xs font-medium text-slate-500">by {selectedBook.author}</p>
              <div className="flex items-center gap-3 pt-2 text-xxs font-medium text-slate-400">
                <span>ISBN: {selectedBook.isbn}</span>
                <span>•</span>
                <span>Category: {selectedBook.category}</span>
              </div>
            </div>
          )}

          <div className="bg-indigo-50/60 border border-indigo-150 rounded-xl p-4">
            <p className="text-xs leading-relaxed text-indigo-950 font-medium">
              <strong>Notice:</strong> Reserved books are held for a maximum of 3 days. Please retrieve your book at the library circulation desk within this period.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowReserveModal(false)}
              className="px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReservation}
              className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl transition text-xs font-semibold cursor-pointer"
            >
              Confirm Reservation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentLibrary;
