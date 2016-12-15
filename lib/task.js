const Task = require('../models/task');
const User = require('../models/user');

const itemsPerPage = 3; //количество задач на странице

/**
 * Получить список задач и вывести на странице
 */
function getList(req, res) {
    //получим всех пользователей
    User.find({}, function (err, userList) {

        //сформируем запрос для поиска
        let query = null;
        if(req.query.search)
            query = { $or: [
                { name: {$regex: new RegExp(req.query.search.trim(), 'gi')} },
                { description: {$regex: new RegExp(req.query.search.trim(), 'gi')} }
            ] };

        //пагинация
        let page = req.query.page || 1;
        let skipItems = (page - 1) * itemsPerPage;

        //определим общее количество задач, удовлетворяющих запросу
        Task.find(query).count().exec(function (e, tasksCount){
            //найдем задачи для текущей страницы
            Task.find(query).sort('deadline').limit(itemsPerPage).skip(skipItems).exec(function (err, tasks) {
                let context = {
                    tasks: tasks.map(function(task){
                        //определим имя и фамилию исполнителя задачи
                        let user = false;
                        if (task.user){
                            for(let i = 0; i < userList.length; i++){
                                if (userList[i].id == task.user){
                                    user = userList[i].name + ' ' + userList[i].lastname;
                                    break;
                                }
                            }
                        }
                        return {
                            id: task.id,
                            name: task.name,
                            description: task.description,
                            user: user,
                            deadline: ('0' + task.deadline.getDate()).slice(-2) + '.' + ('0' + (task.deadline.getMonth() + 1)).slice(-2) + '.' + task.deadline.getFullYear(),
                            isOpen: task.isOpen
                        };
                    }),
                    users: userList,
                    pagination: {
                        pageCount: Math.ceil(tasksCount / itemsPerPage),
                        page: page
                    },
                    pageHome: true,
                    error: req.query.error
                };
                res.render('home', context);
            });
        });
    });
}

/**
 * Добавить задачу и показать страницу со списком
 */
function add(req, res){
    new Task({
        name: req.body.name,
        description: req.body.description,
        deadline: req.body.deadline.toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric'}),
        isOpen: true
    })
    .save(function(err, result){
        if (err)
            res.redirect(303, `/add-task/?error=${err.message}`);
        else
            res.redirect(303, '/');
    });
}

/**
 * Изменить задачу и показать страницу со списком
 */
function edit(req, res){
    let id = req.params.id;
    Task.update({"_id": id}, {$set: req.body}, function(err, result){
        if (err)
            res.redirect(303, `/edit-task/${id}/?error=${err.message}`);
        else
            res.redirect(303, '/');
    });
}

/**
 * Удалить задачу и показать страницу со списком
 */
function remove(req, res){
    let id = req.params.id;
    Task.remove({"_id": id}, function(err, result){
        if (err)
            res.redirect(303, `/?error=${err.message}`);
        else
            res.redirect(303, '/');
    });
}

/**
 * Показать страницу с формой добавления задачи
 */
function showAddForm(req, res){
    let context = {
        pageHome: true,
        error: req.query.error
    };
    res.render('add-task', context);
}

/**
 * Показать страницу с формой редактирования задачи
 */
function showEditForm(req, res){
    let id = req.params.id;
    Task.findById(id, function(err, result){
        let context = {
            task: {
                name: result.name,
                description: result.description,
                deadline: result.deadline.getFullYear() + '-' + ('0' + (result.deadline.getMonth() + 1)).slice(-2) + '-' + ('0' + result.deadline.getDate()).slice(-2),
                id: id
            },
            pageHome: true,
            error: req.query.error
        };
        res.render('edit-task', context);
    });
}

module.exports = {
    getList,
    add,
    edit,
    remove,
    showAddForm,
    showEditForm
};