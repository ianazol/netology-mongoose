const User = require('../models/user');

/**
 * Получить список всех пользователей и показать соответствующую страницу
 */
function getList(req, res) {
    User.find({}, function (err, userList) {
        res.render('users', {users: userList, pageUser: true});
    });
}

/**
 * Показать страницу с формой добавления пользователя
 */
function showAddForm(req, res){
    res.render('add-user', {pageUser: true});
}

/**
 * Добавить пользователя и перенаправить на список пользователей
 */
function add(req, res){
    new User({
        name: req.body.name,
        lastname: req.body.lastname,
    })
    .save(function(err, result){
        if (err)
            console.dir(error);
        res.redirect(303, '/users');
    });
}

/**
 * Удалить пользователя и перенаправить на список пользователей
 */
function remove(req, res){
    let id = req.params.id;
    User.remove({"_id": id}, function(err, result){
        if (err)
            console.dir(error);
        res.redirect(303, '/users');
    });
}

/**
 * Показать страницу с формой редактирования пользователя
 */
function showEditForm(req, res){
    let id = req.params.id;
    User.findById(id, function(err, result){
        let user = {
            name: result.name,
            lastname: result.lastname,
            id: id,
        };
        res.render('edit-user', {user: user, pageUser: true});
    });
}

/**
 * Изменить пользователя и перенаправить на список пользователей
 */
function edit(req, res){
    let id = req.params.id;
    User.update({"_id": id}, {$set: req.body}, function(err, result){
        res.redirect(303, '/users');
    });
}

module.exports = {
    getList,
    showAddForm,
    add,
    remove,
    showEditForm,
    edit
};