-- CreateTable
CREATE TABLE "Event" (
    "idEvent" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "creatorID" TEXT NOT NULL,
    "free" BOOLEAN NOT NULL,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "price" REAL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Event_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "User" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ticket" (
    "idTicket" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT NOT NULL,
    "idEvent" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "participants" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ticket_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_idEvent_fkey" FOREIGN KEY ("idEvent") REFERENCES "Event" ("idEvent") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TicketDetail" (
    "idTicketDetail" TEXT NOT NULL PRIMARY KEY,
    "eventID" TEXT NOT NULL,
    "ticketID" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "document" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    CONSTRAINT "TicketDetail_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event" ("idEvent") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TicketDetail_ticketID_fkey" FOREIGN KEY ("ticketID") REFERENCES "Ticket" ("idTicket") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "idUser" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "document" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "balance" REAL NOT NULL DEFAULT 0,
    "bought" INTEGER NOT NULL DEFAULT 0,
    "confirmed" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_document_key" ON "User"("document");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
