-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "idEvent" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "creatorID" TEXT NOT NULL,
    "free" BOOLEAN NOT NULL,
    "assistants" INTEGER NOT NULL DEFAULT 0,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "price" REAL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Event_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "User" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("cancelled", "completed", "creatorID", "date", "description", "direction", "free", "idEvent", "price", "shortDescription", "title") SELECT "cancelled", "completed", "creatorID", "date", "description", "direction", "free", "idEvent", "price", "shortDescription", "title" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
