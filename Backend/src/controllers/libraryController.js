import mongoose from "mongoose";
import DigitalResource from "../models/DigitalResource.js";
import LibraryBook from "../models/LibraryBook.js";
import LibraryLoan from "../models/LibraryLoan.js";

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const getLibraryOverview = async (req, res) => {
  const studentId = req.user?.id;
  const [books, loans, digitalResources] = await Promise.all([
    LibraryBook.find().sort({ title: 1 }),
    LibraryLoan.find(studentId ? { studentId } : {}).sort({ dueDate: 1 }),
    DigitalResource.find({ isActive: true }).sort({ name: 1 }),
  ]);

  const normalizedLoans = loans.map((loan) => {
    if (loan.status === "active" && new Date(loan.dueDate) < new Date()) {
      loan.status = "overdue";
    }
    return loan;
  });

  res.json({ books, borrowedBooks: normalizedLoans, digitalResources });
};

// Issue #8: Wrapped in a Mongoose transaction so book + loan are atomic
export const reserveBook = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const book = await LibraryBook.findById(req.params.bookId).session(session);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    if (book.availability !== "available") {
      res.status(400);
      throw new Error("Book is not available for reservation");
    }

    book.availability = "reserved";
    book.reservedBy = req.user.id;
    await book.save({ session });

    const reservation = await LibraryLoan.create(
      [
        {
          bookId: book.id,
          studentId: req.user.id,
          title: book.title,
          author: book.author,
          issueDate: new Date(),
          dueDate: addDays(new Date(), 3),
          status: "reserved",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ book, reservation: reservation[0] });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const renewLoan = async (req, res) => {
  const loan = await LibraryLoan.findOne({ _id: req.params.loanId, studentId: req.user.id });
  if (!loan) {
    res.status(404);
    throw new Error("Library loan not found");
  }
  if (!["active", "overdue"].includes(loan.status)) {
    res.status(400);
    throw new Error("Only active or overdue loans can be renewed");
  }

  loan.dueDate = addDays(new Date(loan.dueDate), 14);
  loan.status = "active";
  await loan.save();
  res.json(loan);
};

export const returnLoan = async (req, res) => {
  const loan = await LibraryLoan.findOne({ _id: req.params.loanId, studentId: req.user.id });
  if (!loan) {
    res.status(404);
    throw new Error("Library loan not found");
  }

  loan.status = "returned";
  loan.returnedAt = new Date();
  await loan.save();

  await LibraryBook.findByIdAndUpdate(loan.bookId, {
    availability: "available",
    issuedTo: undefined,
    reservedBy: undefined,
    dueDate: undefined,
  });

  res.json(loan);
};
