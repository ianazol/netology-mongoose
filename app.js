const express    = require("express");
const bodyParser = require("body-parser");
const task       = require('./lib/task');
const user       = require('./lib/user');
const stat       = require('./lib/stat');
const mongoose   = require('mongoose');
const app        = express();
const port       = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/tasks');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

var handlebars = require('express3-handlebars').create({
    defaultLayout:'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', task.getList);
app.post('/add-task', task.add);
app.get('/add-task', task.showAddForm);
app.get('/edit-task/:id', task.showEditForm);
app.post('/edit-task/:id', task.edit);
app.get('/delete-task/:id', task.remove);

app.get('/users', user.getList);
app.get('/add-user', user.showAddForm);
app.post('/add-user', user.add);
app.get('/delete-user/:id', user.remove);
app.get('/edit-user/:id', user.showEditForm);
app.post('/edit-user/:id', user.edit);

app.get('/stat', stat.show);

app.listen(port);