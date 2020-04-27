"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskData = require('../data/tasks');
class Tasks {
    routes(app) {
        app.route('/api/tasks').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const multiTasks = yield taskData.getMultiTasks(req.query);
                return res.status(200).json(multiTasks);
            }
            catch (error) {
                return res.status(400).json({ error: "Could not get tasks!" });
            }
        }));
        app.route('/api/tasks/:id').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params || !req.params.id) {
                    throw "Task id was not provided for get method!";
                }
                const currentTask = yield taskData.getTask(req.params.id);
                return res.status(200).json(currentTask);
            }
            catch (error) {
                return res.status(400).json({ error: "Could not get specific task!" });
            }
        }));
        app.route('/api/tasks').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            const taskInfo = req.body;
            if (!taskInfo) {
                return res.status(400).json({ error: "You must provide data to create a new task!" });
            }
            if (!taskInfo.title || typeof taskInfo.title != "string" || taskInfo.title.length == 0) {
                return res.status(400).json({ error: "Invalid task title was provided" });
            }
            if (!taskInfo.description || typeof taskInfo.description != "string" || taskInfo.description.length == 0) {
                return res.status(400).json({ error: "Invalid task description was provided" });
            }
            if (!taskInfo.hoursEstimated || typeof taskInfo.hoursEstimated != "number") {
                return res.status(400).json({ error: "Invalid task hour estimation was provided" });
            }
            if (taskInfo.completed != undefined && taskInfo.completed != null && typeof taskInfo.completed != "boolean") {
                return res.status(400).json({ error: "Invalid task completion indicator was provided" });
            }
            try {
                console.log(`taskInfo.title = ${taskInfo.title}`);
                console.log(`taskInfo.description = ${taskInfo.description}`);
                console.log(`taskInfo.hoursEstimated = ${taskInfo.hoursEstimated}`);
                console.log(`taskInfo.completed = ${taskInfo.completed}`);
                let newTask = yield taskData.addTask(taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed, taskInfo.comments);
                return res.status(200).json(newTask);
            }
            catch (error) {
                return res.status(400).json({ error: "Could not create new task!" });
            }
        }));
        app.route('/api/tasks/:id').put((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params || !req.params.id) {
                    throw "Task id was not provided for get method!";
                }
                if (!req.body) {
                    throw "Invalid task details were provided";
                }
                if (!req.body.title || typeof req.body.title !== "string" || req.body.title.length === 0) {
                    throw "Invalid task id was provided";
                }
                if (!req.body.description || typeof req.body.description !== "string" || req.body.description.length === 0) {
                    throw "Invalid task description was provided";
                }
                if (!req.body.hoursEstimated || typeof req.body.hoursEstimated !== "number") {
                    throw "Invalid task hours estimated was provided";
                }
                if (req.body.completed == undefined || req.body.completed == null || typeof req.body.completed !== "boolean") {
                    throw "Invalid task completion was provided";
                }
                const newTask = yield taskData.putTask(req.params.id, req.body);
                return res.status(200).json(newTask);
            }
            catch (error) {
                return res.status(400).json({ error: "Could not update task!" });
            }
        }));
        app.route('/api/tasks/:id').patch((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params || !req.params.id) {
                    throw "Task id was not provided for get method!";
                }
                if (!req.body.title && !req.body.description && !req.body.hoursEstimated && req.body.completed == undefined) {
                    throw "No request body was provided!";
                }
                const newTask = yield taskData.patchTask(req.params.id, req.body);
                return res.status(200).json(newTask);
            }
            catch (error) {
                return res.status(400).json({ error: "Could not update task!" });
            }
        }));
        app.route('/api/tasks/:id/comments').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params || !req.params.id) {
                    throw "No task id was provided!";
                }
                if (!req.body) {
                    throw "No task comment details were provided!";
                }
                const taskId = req.params.id;
                const taskInfo = req.body;
                if (!taskInfo.name || typeof taskInfo.name != "string" || taskInfo.name.length === 0) {
                    throw "Invalid comment name was provided";
                }
                if (!taskInfo.comment || typeof taskInfo.comment != "string" || taskInfo.comment.length === 0) {
                    throw "Invalid comment was provided";
                }
                let newComment = yield taskData.addComment(taskId, taskInfo);
                return res.status(200).json(newComment);
            }
            catch (error) {
                return res.status(400).json({ error: "Could not add new comment!" });
            }
        }));
        app.route('/api/tasks/:taskId/:commentId').delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params) {
                    throw "No request parameters were provided!";
                }
                if (!req.params.taskId) {
                    throw "No task id was provided!";
                }
                if (!req.params.commentId) {
                    throw "No comment id was provided!";
                }
                const taskId = req.params.taskId;
                const commentId = req.params.commentId;
                const updatedTask = yield taskData.deleteComment(taskId, commentId);
                return res.status(200).json(updatedTask);
            }
            catch (error) {
                return res.status(400).json({ error: "Could not delete the comment!" });
            }
        }));
        app.use('*', (req, res) => {
            res.status(404).json({ error: 'Not found' });
        });
    }
}
exports.Tasks = Tasks;
