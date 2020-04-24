import { MongoCollections } from '../config/mongoCollections';
import { Collection } from 'mongodb';
import * as uuidv4 from 'uuid/v4';
const mongoCollections: MongoCollections = new MongoCollections();
// const tasks: Promise<Collection> = mongoCollections.getCollectionFn("tasks");

    interface Task {
        _id?: string;   //"?" means _id is not required
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

    /** 
     * Gets the task with the provided id.
     * @param task_id the id of a specific task.
     * @returns single_task the task with provided id.
    */
    async function getTask(task_id: string): Promise<Task> {
        //validates function arguments
        if (arguments.length !== 1) {
            throw `Wrong number of argument(s) was given to create function! Number of argument(s) given = ${arguments.length}`;
        }
        if (!task_id || typeof task_id != "string" || task_id.length === 0) {
            throw "Task id with wrong type was provided";
        }
        const taskCollection: Collection = await mongoCollections.getCollectionFn("tasks");
        const single_task: Task = await taskCollection.findOne({_id: task_id});
        if (single_task === null) {  //No matching ID task found
            throw `No task found with ID: ${task_id}`;
        }

        return single_task;
    }

    /** 
     * Gets multiple tasks at once, by default the function would return 20 tasks if 
     * no task parameters were provided. If skip parameter is provided then the first n tasks would
     * be skipped. If take parameter is provided then y most tasks would be shown. The maximum
     * number of tasks that would be shown is 100.
     * 
     * @param taskParams the parameters like skip and take.
     * @returns an array of task objects.
    */
    async function getMultiTasks(taskParams: {skip: string, take: string}): Promise<Array<Task>> {
        //validates function arguments
        if (arguments.length !== 1) {
            throw `Wrong number of argument(s) was given to create function! Number of argument(s) given = ${arguments.length}`;
        }
        let skip_index: number = 0;
        let max_num: number = 20;
        if (taskParams !== undefined && taskParams != null) {
            if (taskParams.skip !== undefined && taskParams.skip !== null && typeof taskParams.skip === "string") {
                //can the parameter value have decimal?
                skip_index = parseInt(taskParams.skip);
            }
            if (taskParams.take != undefined && taskParams.take != null && typeof taskParams.take === "string") {
                //can the parameter value have decimal?
                max_num = parseInt(taskParams.take);
            }
        }
        if(max_num > 100) {
            max_num = 100;
        }
        if (isNaN(skip_index) || isNaN(max_num)) {
            throw "Invalid task parameter(s) was provided!";
        }

        const taskCollection: Collection = await mongoCollections.getCollectionFn("tasks");
        let multi_tasks: Array<Task> = await taskCollection.find({}).skip(skip_index).limit(max_num).toArray();
        
        return multi_tasks;
    }

    /** 
     * Inserts a new task with the provided task information.
     * @param title the string title of the task.
     * @param desc the string description of the task.
     * @param hrEst the number of hour estimated of the task.
     * @param completed completion status of the task.
     * @param comments comments of the task.
    */
    async function addTask(title: string, desc: string, hrEst: number, completed: boolean, comments): Promise<Task> {
        //validates function arguments
        if (arguments.length !== 5) {
            throw `Wrong number of argument(s) was given to create function! Number of argument(s) given = ${arguments.length}`;
        }

        if (!title || typeof title != "string" || title.length === 0) {
            throw "Invalid task title was provided";
        } else if (!desc || typeof desc != "string" || desc.length === 0) {
            throw "Invalid task description was provided";
        } else if (!hrEst || typeof hrEst != "number") {
            throw "Invalid task estimated hours was provided";
        }
        let complete_param: boolean = false;
        if (completed != undefined && completed != null && typeof completed == "boolean") {
            complete_param = completed;
        } 

        const newTask: Task = {
            _id: uuidv4(),
            title: title,
            description: desc,
            hoursEstimated: hrEst,
            completed: complete_param,
            comments: []
        };

        const taskCollection: Collection = await mongoCollections.getCollectionFn("tasks");
        interface newInsertInfo {
            insertedCount: number;
            insertedId: string;
        }
        const newInsertInformation: newInsertInfo = await taskCollection.insertOne(newTask);
        if (newInsertInformation.insertedCount === 0) {
            throw "Could not create new task";
        }
        const newTaskId: string = newInsertInformation.insertedId;
        const task: Task = await taskCollection.findOne({_id: newTaskId});
        return task;
    }

    /** 
     * Adds a new comment object to a specific task. If no task exists with the same task id
     * then an error would be thrown.
     * 
     * @param task_id the id of a specific task.
     * @param comments object with name and comment parameters.
     * @returns newComment the newly added comment object.
    */
    async function addComment(task_id: string, comments: {name: string, comment: string}): Promise<Task> {
        //validates function arguments
        if (arguments.length !== 2) {
            throw `Wrong number of argument(s) was given to create function! Number of argument(s) given = ${arguments.length}`;
        }

        if (task_id == undefined || task_id == null || task_id.length === 0) {
            throw "Invalid task id was provided";
        }
        if (comments == undefined || comments == null || typeof comments != "object") {
            throw "Invalid task comments were provided";
        }
        if(!comments.name || typeof comments.name != "string" || comments.name.length === 0) {
            throw "Invalid comment name was provided";
        }
        if(!comments.comment || typeof comments.comment != "string" || comments.comment.length === 0) {
            throw "Invalid comment was provided";
        }

        const taskCollection: Collection = await mongoCollections.getCollectionFn("tasks");
        const oldTask: Task = await taskCollection.findOne({_id: task_id})
        if(!oldTask) {
            throw `No task exists with the provided id ${task_id}`;
        }
        const newComment: comment = {
            _id: uuidv4(),
            name: comments.name,
            comment: comments.comment
        };
        const updateTask: {modifiedCount: number} = await taskCollection.updateOne({_id: task_id}, {$addToSet: {comments: newComment}});
        if(!updateTask || updateTask.modifiedCount == 0) {
            throw "Unable to update task comment";
        }
        let updatedTask: Task = this.getTask(task_id);
        return updatedTask;
    }

    /** 
     * Updates an existing task with the provided task details without changing
     * the original comments.
     * 
     * @param task_id the id of an existing task.
     * @param task_details the task parameters.
     * @returns updated task object.
    */
    async function putTask(task_id: string, task_details: Task): Promise<Task> {
        //validates function arguments
        if (arguments.length !== 2) {
            throw `Wrong number of argument(s) was given to create function! Number of argument(s) given = ${arguments.length}`;
        }
        if (!task_id || typeof task_id !== "string" || task_id.length === 0) {
            throw "Invalid task id was provided";
        }
        if (!task_details || typeof task_details !== "object") {
            throw "Invalid task details were provided";
        }
        if (!task_details.title || typeof task_details.title !== "string" || task_details.title.length === 0) {
            throw "Invalid task id was provided";
        }
        if (!task_details.description || typeof task_details.description !== "string" || task_details.description.length === 0) {
            throw "Invalid task description was provided";
        }
        if (!task_details.hoursEstimated || typeof task_details.hoursEstimated !== "number") {
            throw "Invalid task hours estimated was provided";
        }
        if (task_details.completed == undefined || task_details.completed == null || typeof task_details.completed !== "boolean") {
            throw "Invalid task completion was provided";
        }
        const taskCollection: Collection = await mongoCollections.getCollectionFn("tasks");
        const old_task: Task = await taskCollection.findOne({_id: task_id});
        if (old_task === null) {  //No matching ID task found
            throw `No task found with ID: ${task_id}`;
        }
        const newTask: Task = {
            title: task_details.title,
            description: task_details.description,
            hoursEstimated: task_details.hoursEstimated,
            completed: task_details.completed,
            comments: old_task.comments //maintains the previous comments
        };

        const updatedTask: {modifiedCount: number} = await taskCollection.updateOne({_id: task_id}, {$set: newTask});
        if (updatedTask.modifiedCount === 0) {
            throw 'Could not update the task successfully';
        }

        let resultTask: Task = await this.getTask(task_id);

        return resultTask;
    }

    /** 
     * Updates an existing task with the provided task details (can be partial) without
     * changing the original comments.
     * 
     * @param task_id the id of an existing task.
     * @param task_details the task parameters.
     * @returns updated task object.
    */
    async function patchTask(task_id: string, task_details: Task): Promise<Task> {
        //validates function arguments
        if (arguments.length !== 2) {
            throw `Wrong number of argument(s) was given to create function! Number of argument(s) given = ${arguments.length}`;
        }
        if (!task_id || typeof task_id !== "string" || task_id.length === 0) {
            throw "Invalid task id was provided";
        }
        if (!task_details || typeof task_details !== "object") {
            throw "Invalid task details were provided";
        }
        const taskCollection: Collection = await mongoCollections.getCollectionFn("tasks");
        const old_task: Task = await taskCollection.findOne({_id: task_id});
        if (old_task === null) {  //No matching ID task found
            throw `No task found with ID: ${task_id}`;
        }
        let newTask = {} as Task;   //asserts that this empty object will be used as Task object
        if (task_details.title && typeof task_details.title == "string" && task_details.title.length !== 0) {
            newTask.title = task_details.title;
        }
        if (task_details.description && typeof task_details.description == "string" && task_details.description.length !== 0) {
            newTask.description = task_details.description;
        }
        if (task_details.hoursEstimated && typeof task_details.hoursEstimated == "number") {
            newTask.hoursEstimated = task_details.hoursEstimated;
        }
        if (task_details.completed !== null && task_details.completed !== undefined && typeof task_details.completed == "boolean") {
            newTask.completed = task_details.completed;
        }
        newTask.comments = old_task.comments;

        const updatedTask: {modifiedCount: number} = await taskCollection.updateOne({_id: task_id}, {$set: newTask});
        if (updatedTask.modifiedCount === 0) {
            throw 'Could not update the task successfully';
        }
        let resultTask: Task = await this.getTask(task_id);
        return resultTask;
    }

    /** 
     * Deletes a specific comment of a specific task with the provided id.
     * 
     * @param task_id the id of an existing task.
     * @param comment_id the id of a specific comment.
     * @returns boolean indicates the comment has been removed successfully.
    */
    async function deleteComment(task_id: string, comment_id: string) {
        //validates function arguments
        if (arguments.length !== 2) {
            throw `Wrong number of argument(s) was given to create function! Number of argument(s) given = ${arguments.length}`;
        }
        if (!task_id || typeof task_id !== "string" || task_id.length === 0) {
            throw "Invalid task id was provided";
        }
        if (!comment_id || typeof comment_id !== "string" || comment_id.length === 0) {
            throw "Invalid comment id was provided";
        }
        const taskCollection: Collection = await mongoCollections.getCollectionFn("tasks");
        //checks if the task exist or not
        const single_task: Task = await taskCollection.findOne({_id: task_id});
        if (single_task === null) {  //No matching ID task found
            throw `No task found with ID: ${task_id}`;
        }

        //removes the comment from the task
        const updationInfo: {modifiedCount: number} = await taskCollection.updateOne({_id: task_id}, {$pull: {comments: {_id: comment_id}}});
        if(!updationInfo || updationInfo.modifiedCount == 0) {
            throw "Could not delete comment with the specific id!";
        }
        let resultTask: Task = await this.getTask(task_id);
        return resultTask;
    }

module.exports = {
    getTask,
    getMultiTasks,
    addTask,
    addComment,
    putTask,
    patchTask,
    deleteComment
}