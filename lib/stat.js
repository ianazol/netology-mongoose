const MongoClient = require('mongodb').MongoClient;

/**
 * список пользователей и количество у них закрытых задач,
 * отсортированных по убыванию.
 */
function show(req, res){
    MongoClient.connect('mongodb://localhost:27017/tasks', function(err, db) {
        let collection = db.collection('users');
        collection.aggregate([
            {$lookup: {
                from: "tasks",
                localField: "_id",
                foreignField: "user",
                as: "tasks"
            }},
            {$unwind: "$tasks"},
            {$match: {
                "tasks.isOpen": false
            }},
            {$project: {
                "name" : 1,
                "lastname" : 1,
                "count": {$add: [1]}
            }},
            {$group: {
                "_id": "$_id",
                "name": {$first: "$name"},
                "lastname": {$first: "$lastname"},
                "count": {$sum: "$count"}
            }},
            {$sort: {
                "count": -1
            }}
        ], function(err, result){
            res.render('stat', {users: result, pageStat: true});
            db.close();
        });
    });
}

module.exports = {show};
