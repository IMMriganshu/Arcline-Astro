# Security Specification for Submissions

## Data Invariants
- Submissions are public-read (or restricted to admin).
- Submissions can be created by anyone.
- Submissions cannot be updated or deleted by public users.

## Dirty Dozen Payloads
1. Empty payload
2. Payload without required fields
3. Payload with excessive string lengths
4. Payload with invalid URL format
5. Payload with invalid email format
6. Payload with ghost fields (e.g. `isAdmin: true`)
7. Payload with malicious ID (path injection)
8. Attempt to update existing submission
9. Attempt to delete submission
10. Attempt to list all submissions (if restricted)
11. Large payload for string fields
12. Timestamp poisoning

## Test Runner
(TBD in `firestore.rules.test.ts`)
