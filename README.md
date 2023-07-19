# PongProject (ft_transcendence)
(Group Project)

Collaborated in the development of a multiplayer online Pong game website (single page application), using React as a frontend library, Nest.js as a backend framework, and PostgreSQL as a relational database.
Enhanced team cooperation, adaptability, and full-stack development skills through this TypeScript project.

## Overview
Requirements for the implementation of the project:
  - The backend of our website is written in NestJS.
  - The frontend must be written in TypeScript using the React library.
  - We used the latest stable versions of each library.
  - We used a PostgreSQL database.
  - Our site is a single page application. The user has the ability to use the "Back" and "Forward" buttons.
  - Our site is compatible with the latest stable up-to-date version of Google Chrome, Safari and Mozilla Firefox.
  - The user does not encounter unhandled errors and exceptions while browsing the website.
  - Everything launch with one call: docker-compose up --build.

## Security concerns
  - All passwords are stored in the database in hashed form.
  - Our site is protected from SQL injection.
  - We have implemented server side validation for forms and any user input.

## User Account
  - The user logs in using intranet 42's OAuth system.
  - The user has the option to choose a unique name to be displayed on the website.
  - The user has the option to upload an avatar. If the user does not have an avatar, we set the default avatar.
  - The user has the option to enable two-factor authentication Google Authenticator.
  - The user has the ability to add other users as friends and see their current status (online, offline, in game).
  - Statistics (wins and losses, rating level, achievements) are displayed in the user's profile.
  - Each user has a history of matches, including 1v1 games and ladder. Anyone who is logged in has the ability to consult with him.

## Chat
  - The user has the ability to create channels (chats), which can be both public and private, or password protected.
  - The user has the ability to send direct messages to other users.
  - The user has the ability to block other users. Thus, they will no longer see messages from a blocked account.
  - The user who created a new channel is automatically assigned as the owner of the channel until he leaves it.
  - The channel owner can set the password required to access the channel, change it, and delete it.
  - The channel owner is the channel administrator. They can designate other users as administrators.
  - A user who is a channel administrator can kick, ban, or mute (for a limited time) other users, but not channel owners.
  - The user has the ability to invite other users to play pong through the chat interface.
  - The user has access to the profiles of other players through the chat interface.
