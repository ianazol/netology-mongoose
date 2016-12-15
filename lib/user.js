const User = require('../models/user');

/**
 * Получить список всех пользователей и показать соответствующую страницу
 */
function getList(req, res) {
    User.find({}, function (err, userList) {
        let context = {
            users: userList,
            error: req.query.error,
            pageUser: true
        };
        res.render('users', context);
    });
}

/**
 * Показать страницу с формой добавления пользователя
 */
function showAddForm(req, res){
    let context = {
        pageUser: true,
        error: req.query.error
    };
    res.render('add-user', context);
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
            res.redirect(303, `/add-user/?error=${err.message}`);
        else
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
            res.redirect(303, `/users/?error=${err.message}`);
        else
            res.redirect(303, '/users');
    });
}

/**
 * Показать страницу с формой редактирования пользователя
 */
function showEditForm(req, res){
    let id = req.params.id;
    User.findById(id, function(err, result){
        let context = {
            user: {
                name: result.name,
                lastname: result.lastname,
                id: id,
                error: req.query.error
            },
            pageUser: true
        };
        res.render('edit-user', context);
    });
}

/**
 * Изменить пользователя и перенаправить на список пользователей
 */
function edit(req, res){
    let id = req.params.id;
    User.update({"_id": id}, {$set: req.body}, function(err, result){
        if (err)
            res.redirect(303, `/edit-user/${id}/?error=${err.message}`);
        else
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