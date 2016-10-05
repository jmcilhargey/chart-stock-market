// Create collection in mongo shell - Note can't be capped because docs need option to delete

db.createCollection("stocks", {
  autoIndexId: true,
  size: 1048576,
  max: 100
});
