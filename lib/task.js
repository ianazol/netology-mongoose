const Task = require('../models/task');
const User = require('../models/user');

const itemsPerPage = 10; //количество задач на странице


/**
 * Получить список задач и показать соответствующую страницу
 */
function getList(req, res) {
    //получим всех пользователей
    User.find({}, function (err, userList) {

        //сформируем запрос дя поиска
        let query = null;
        if(req.query.search)
            query = { $or: [
                { name: {$regex: new RegExp(req.query.search.trim(), 'gi')} },
                { description: {$regex: new RegExp(req.query.search.trim(), 'gi')} }
            ] };

        //пагинация
        let page = req.query.page || 1;
        let skipItems = (page - 1) * itemsPerPage;

        //найдем задачи
        Task.find(query)
            .sort('deadline')
            .limit(itemsPerPage)
            .skip(skipItems)
            .exec(function (err, tasks) {
                var context = {
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
                            deadline: task.deadline ? task.deadline.getDate()+'.'+(task.deadline.getMonth() + 1)+'.'+ task.deadline.getFullYear(): false,
                            isOpen: task.isOpen
                        };
                    }),
                    users: userList,
                    pageHome: true
                };
                res.render('home', context);
        });
    });
}

/**
 * Добавить задачу и перенаправить на список задач
 */
function add(req, res){
    new Task({
            name: req.body.name,
            description: req.body.description,
            deadline: req.body.deadline ? req.body.deadline.toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric'}) : false,
            isOpen: true
        })
    .save(function(err, result){
        if (err)
            console.dir(error);
        res.redirect(303, '/');
    });
}

/**
 * Изменить задачу и перенаправить на список задач
 */
function edit(req, res){
    let id = req.params.id;
    Task.update({"_id": id}, {$set: req.body}, function(err, result){
        res.redirect(303, '/');
    });
}

/**
 * Удвлить задачу и перенаправить на список задач
 */
function remove(req, res){
    let id = req.params.id;
    Task.remove({"_id": id}, function(err, result){
        if (err)
            console.dir(error);
        res.redirect(303, '/');
    });
}

/**
 * Показать страницу с формой добавления задачи
 */
function showAddForm(req, res){
    res.render('add-task', {pageHome: true});
}

/**
 * Показать страницу с формой редактирования задачи
 */
function showEditForm(req, res){
    let id = req.params.id;
    Task.findById(id, function(err, result){
            let data = {
                name: result.name,
                description: result.description,
                deadline: result.deadline.getFullYear()+'-'+(result.deadline.getMonth() + 1)+'-'+result.deadline.getDate(),
                id: id
            };
            res.render('edit-task', {task: data, pageHome: true});
        }
    );
}

module.exports = {
    getList,
    add,
    edit,
    remove,
    showAddForm,
    showEditForm
};