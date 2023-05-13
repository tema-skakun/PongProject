### The operational USER in the game

The game has a lot of variables that are only important within that single game; e.g playernumber.

To not liter our `UserEntity`, I have an operational client class in src/classes/client.ts. That only holds `game relevant information and the intraId`.

Note: At the end of each game the relevant statistics are updated in the actual `UserEntity` via. the `UserCRUD`, found via the IntraId.
