import {Request, Response} from 'express';
const taskData = require('../data/tasks');
interface Task {
    _id?: string; //"?" means _id is not required
    title: string;
    description: string;
    hoursEstimated: number;
    completed: boolean;
    comments: Array<object>;
}

interface comment {
    _id: string;
    name: string;
    comment: string;
}

export class Tasks {
    
    
    public routes (app): void {
        app.route('/api/tasks').get(async (req: Request, res: Response) => {
            try {
                const multiTasks: Array<Task> = await taskData.getMultiTasks(req.query);
                return res.status(200).json(multiTasks);
            } catch (error) {
                return res.status(400).json({ error: "Could not get tasks!" });
            }
        });

        app.route('/api/tasks/:id').get(async (req: Request, res: Response) => {
            try {
                if (!req.params || !req.params.id) {
                    throw "Task id was not provided for get method!";
                }
                const currentTask: Task = await taskData.getTask(req.params.id);
                return res.status(200).json(currentTask);
            } catch (error) {
                return res.status(400).json({ error: "Could not get specific task!" });
            }
        });

        app.route('/api/tasks').post(async (req: Request, res: Response) => {
            const taskInfo: Task = req.body;
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
                let newTask: Task = await taskData.addTask(taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed, taskInfo.comments);
                return res.status(200).json(newTask);
            } catch (error) {
                return res.status(400).json({ error: "Could not create new task!" });
            }
        });

        app.route('/api/tasks/:id').put(async (req: Request, res: Response) => {
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
                const newTask: Task = await taskData.putTask(req.params.id, req.body);
                return res.status(200).json(newTask);
            } catch (error) {
                return res.status(400).json({ error: "Could not update task!" });
            }
        });

        app.route('/api/tasks/:id').patch(async (req: Request, res: Response) => {
            try {
                if (!req.params || !req.params.id) {
                    throw "Task id was not provided for get method!";
                }
                if (!req.body.title && !req.body.description && !req.body.hoursEstimated && req.body.completed == undefined) {
                    throw "No request body was provided!";
                }
                const newTask: Task = await taskData.patchTask(req.params.id, req.body);
                return res.status(200).json(newTask);
            } catch (error) {
                return res.status(400).json({ error: "Could not update task!" });
            }
        });

        app.route('/api/tasks/:id/comments').post(async (req: Request, res: Response) => {
            try {
                if (!req.params || !req.params.id) {
                    throw "No task id was provided!";
                }
                if (!req.body) {
                    throw "No task comment details were provided!";
                }
                const taskId: string = req.params.id;
                const taskInfo: {name: string, comment: string} = req.body;
                if (!taskInfo.name || typeof taskInfo.name != "string" || taskInfo.name.length === 0) {
                    throw "Invalid comment name was provided";
                }
                if (!taskInfo.comment || typeof taskInfo.comment != "string" || taskInfo.comment.length === 0) {
                    throw "Invalid comment was provided";
                }
                let newComment: comment = await taskData.addComment(taskId, taskInfo);
                return res.status(200).json(newComment);
            } catch (error) {
                return res.status(400).json({ error: "Could not add new comment!" });
            }
        });

        app.route('/api/tasks/:taskId/:commentId').delete(async (req: Request, res: Response) => {
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
                const taskId: string = req.params.taskId;
                const commentId: string = req.params.commentId;
                const updatedTask: Task = await taskData.deleteComment(taskId, commentId);
                return res.status(200).json(updatedTask);
            } catch (error) {
                return res.status(400).json({ error: "Could not delete the comment!" });
            }
        });
        app.use('*', (req, res) => {
            res.status(404).json({error: 'Not found'});
        });
    }
}