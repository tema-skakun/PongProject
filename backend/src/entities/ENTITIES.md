# Entity Folder Structure

Each entity has its own folder.
The folder should contain the following files:

## DTOs

Data Transfer Objects (DTOs) are used to transmit user data from the frontend.
Create a separate file for each DTO in the entity's folder,
naming convention `<EntityName>.dto.ts`.

DTOs need to be validated by the class-validator!

## Interfaces

Create separate files for interfaces that define the shape of the data used for updating or creating a user.
naming convention `<EntityName>.interface.ts`.

## Response Classes

Create separate files for classes that represent the transformed user entity for the response to the frontend.
Name these files using a convention like `<EntityName>.transformed.ts`.

In summary, the entity folder should contain separate files for DTOs, interfaces, and response classes, each following a clear naming convention.
