const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

//GET tasks
router.get('/', async(req, res) => {
    try 
    {
        const tasks = await Task.find().sort({createdAt: -1});
        res.status(200).json(tasks);
    } catch (error) 
    {
        // console.error('GET /tasks error:', error);
        res.status(500).json({ message:'Failed to fetch tasks'});
    }        
});

//POST create a new task
router.post('/', async (req, res) => {
    try 
    {
        const { title } = req.body;

        if (!title || !title.trim()) 
        {
            return res.status(400).json({message: 'Title is reqired'});
        }

        const newTask = await Task.create({
            title: title.trim(),
        });
        res.status(201).json(newTask);
    } catch (error)
    {
        res.status(500).json({message: 'Failed to create task'});
    }
});

//PUT update task
router.put('/:id', async (req, res) => {
    try
    {
        const {title, complete} = req.body;
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        
        if (complete !== undefined)
            updateData.complete = complete;

        const updatedTask = await Task.findByIdAndUpdate (
            req.params.id,
            updateData,
            {new: true, runValidators: true}
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found'});
        }

        res.status(200).json(updatedTask);
    } catch
    {
        console.error('PUT /tasks/:id error:', error);
        res.status(500).json({message: 'Failed to update task'});
    }
});

//DELETE task
router.delete('/:id', async (req, res) => {
    try
    {
        const deleteTask = await Task.findByIdAndDelete(req.params.id);

        if(!deleteTask)
        {
            return res.status(404).json({message: ' Task not found'});
        }

        res.status(200).json({message: 'Task deleted successfully'});
    }
    catch
    {
        res.status(500).json({message: 'Failed to delete task'});
    }
});

module.exports = router;