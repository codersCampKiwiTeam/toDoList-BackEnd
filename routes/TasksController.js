const {Task} = require('../models/task');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.js').isAuthenticated

// pobiera wszystkie zadania
router.get('/', authMiddleware, async (req, res) => {
	try {
	  const tasks = await Task.find({ userId: req.user._id }).sort('date');
	  res.send(tasks);
	}
	catch(ex) {
        console.log(ex);
        return res.status(500).send('There was an error while processing the request');
    }
});

// dodaje zadanie
router.post('/', authMiddleware, validateTask, async (req, res) => {
	try {
		task = await req.task.save();
		res.send(req.task);
	}
    catch(ex) {
        console.log(ex);
        return res.status(500).send('There was an error while processing the request');
    }
});

// aktualizuje zadanie wskazane przez ID
router.put('/:id', authMiddleware, preprocessTaskRequestById, validateTask, async (req, res) => {
	try {
		await req.task.save();
		res.send(req.task);
	}
	catch(ex) {
        console.log(ex);
        return res.status(500).send('There was an error while processing the request');
    }
});

// zmienia stan zadania z wykonanego na niewykonane i odwrotnie
router.put('/toggleSolved/:id', authMiddleware, preprocessTaskRequestById, async (req, res) => {
	try {
		req.task.solved = !req.task.solved;
		await req.task.save();
		res.send(req.task);
	}
	catch(ex) {
        console.log(ex);
        return res.status(500).send('There was an error while processing the request');
    }
});

// usuwa zadanie wskazane przez ID
router.delete('/:id', authMiddleware, preprocessTaskRequestById, async (req, res) => {
	try {
		await req.task.remove();
		res.send(req.task);
	}
	catch(ex) {
        console.log(ex);
        return res.status(500).send('There was an error while processing the request');
    }
});

// pobiera dane zadania wskazanego przez ID
router.get('/:id', authMiddleware, preprocessTaskRequestById, async (req, res) => {
	try {

		res.send(req.task);
	}
	catch(ex) {
        console.log(ex);
        return res.status(500).send('There was an error while processing the request');
    }
});

// funkcja middleware, która wstępnie sprawdza poprawność requestów, w których jest odwołanie do zadania poprzez ID
async function preprocessTaskRequestById(req, res, next) {
	try {
		if (req.params.id == undefined) {
			return res.status(400).send('The task ID was not provided');
		}

		const task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(400).send('The task with the given ID was not found');
		}
		else if (task.userId !== req.user._id) {
			return res.status(400).send('The task belongs to another user');
		}

		req.task = task;
		next();
	}
	catch(ex) {
        console.log(ex);
        return res.status(500).send('There was an error while processing the request');
    }
}

// funkcja middleware, która waliduje poprawność danych dodawanego lub edytowanego zadania
async function validateTask(req, res, next) {
	try {
		if (req.task === undefined) {
			req.task = new Task();
			req.task.userId = req.user._id;
		}

		req.task.name = req.body.nameTask;
		req.task.date = req.body.dateTask;
		req.task.description = req.body.description;
		req.task.status = req.body.status;

		let validationResult = req.task.validateInput();

		if (validationResult.error !== undefined) {
			return res.status(400).send(validationResult.error.details.map(i => i.message).join("\r\n"));
		}

		next();
	}
	catch(ex) {
        console.log(ex);
        return res.status(500).send('There was an error while processing the request');
    }
}

module.exports = router;
