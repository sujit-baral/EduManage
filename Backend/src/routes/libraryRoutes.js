import express from "express";
import {
  getLibraryOverview,
  renewLoan,
  reserveBook,
  returnLoan,
} from "../controllers/libraryController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/", protect, asyncHandler(getLibraryOverview));
router.post("/books/:bookId/reserve", protect, authorize("student"), validateObjectId("bookId"), asyncHandler(reserveBook));
router.patch("/loans/:loanId/renew", protect, authorize("student"), validateObjectId("loanId"), asyncHandler(renewLoan));
router.patch("/loans/:loanId/return", protect, authorize("student"), validateObjectId("loanId"), asyncHandler(returnLoan));

export default router;
