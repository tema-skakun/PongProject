# Module Structure

## CRUD Service

Each module that manages an entity has a **CRUD Service**.
The CRUD Service provides the basic Create, Read, Update, and Delete operations for managing the entity.

## Gateway

Each module that represents one view on the frontend,
and can emit events that are not requested by the client,
has a **Gateway**.
