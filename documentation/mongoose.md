# Mongoose

To interact with MongoDB I will be using mongoose to enforce an schema to it. When creating a new collection what it's going to be needed is the following:

- create an schema and a model
- after that create an IModel interface to attach to the model
- create indexes for queried by fields int eh collection
- use the generic validator to check in runtime the DB return
