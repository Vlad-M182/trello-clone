"use strict";

function drag(e) {
	e.dataTransfer.setData('id', e.target.id);
}

function drop(e) {
	let itemId = e.dataTransfer.getData('id');
	if (e.target.className !== 'group-content') {
		e.target.closest('.group-content').append(document.getElementById(itemId));
	} else {
		e.target.append(document.getElementById(itemId));
	}
	createBoardObject(e.target.closest('.board'));
}

/* 
функція яка повертає нову HTML розмітку для нової дошки
приймає назву дошки, id дошки і об'єкт з групами які мають бути у цій дошці (необов'язково)
*/
function createBoard(boardTitle, boardId, boardGroups = {}) {
	return `
	<div class="board" id="${boardId}">
		<div class="board-top">
			<input class="my-input board-title" value="${boardTitle}" placeholder="Board title" />
			<button class="my-button board-delete-button" type="button">Delete board</button>
		</div>
		<div class="board-content">
			${(() => {
			if (Object.keys(boardGroups)) {
				return Object.keys(boardGroups).reduce((prev, group) =>
					prev + createGroup(group, boardGroups[group].id, boardGroups[group]?.tasks), ``);
			}
		})()}
			<form class="form-create create-group" name="create-group">
				<input class="my-input form-create-input crate-group-input" type="text" name="group-name" placeholder="New group title">
				<button class="my-button form-create-button crate-group-button" type="submit">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
						<path
							d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z" />
					</svg>
				</button>
			</form>
		</div>
	</div>`;
}

/*
функція яка повертає нову HTML ромітку для нової групи
приймає назву групи, id групи і об'єкт з тасками, які мають бути у цій групі (необов'язково)
*/
function createGroup(groupTitle, groupId, groupTasks = {}) {
	return `
		<div class="group" id="${groupId}">
			<div class="group-top">
				<input class="my-input group-title" type="text" name="group-title1" value="${groupTitle}" />
			</div>
			<div class="group-content">
				${(() => {
			if (Object.keys(groupTasks)) {
				return Object.keys(groupTasks).reduce((prev, task) => prev + createTask(groupTasks[task]), ``);
			}
		})()}
			</div >
			<form class="add-new-task" name="add-new-task">
				<input class="my-input new-task" type="text" name="task-text" value="" placeholder="New task">
					<button class="my-button add-task-button" type="submit">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
							<path
								d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z" />
						</svg>
					</button>
			</form>
		</div>
		`;
}

/* 
функція яка повертає HTML розмітку для нового taskа, приймає об'єкт з інфою для taska
*/
function createTask({ id, text, status }) {
	return `
		<div div class="task" draggable="true" id="${id}" data-status="${status}">
			<div class="task-content">
				${text}
			</div>
			<button class="my-button task-button" type="button">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
					<path
						d="M64 360C94.93 360 120 385.1 120 416C120 446.9 94.93 472 64 472C33.07 472 8 446.9 8 416C8 385.1 33.07 360 64 360zM64 200C94.93 200 120 225.1 120 256C120 286.9 94.93 312 64 312C33.07 312 8 286.9 8 256C8 225.1 33.07 200 64 200zM64 152C33.07 152 8 126.9 8 96C8 65.07 33.07 40 64 40C94.93 40 120 65.07 120 96C120 126.9 94.93 152 64 152z" />
				</svg>
			</button>
			<ul class="task-menu">
				<li class="task-menu-item">
					<button class="my-button task-done-button" type="button">
						${status ? 'Done' : 'Make'}
					</button>
				</li>
				<li class="task-menu-item">
					<button class="my-button task-edit-button" type="button">Edit</button>
				</li>
				<li class="task-menu-item">
					<button class="my-button task-delete-button" type="button">Delete</button>
				</li>
			</ul>
		</div>
		`;
}

/*
функція для зміни статуса taska
*/
function makeTask(task) {
	const doneButton = task.querySelector('.task-done-button');

	if (task.dataset.status === 'false') {
		task.dataset.status = 'true';
		doneButton.innerText = 'Done';
	} else {
		task.dataset.status = 'false';
		doneButton.innerText = 'Make';
	}

	createBoardObject(task.closest('.board'));
}

/*
функція для редагування taska
*/
function editTask(task) {
	const taskText = task.firstElementChild.innerText;
	task.firstElementChild.innerText = prompt('Edit task', taskText) || taskText;

	createBoardObject(task.closest('.board'));
}

/*
функція для видалення taska
*/
function deleteTask(taskId) {
	const board = document.getElementById(taskId).closest('.board');
	document.getElementById(taskId).remove();
	createBoardObject(board);
}

/*
функція для видалення дошки
*/
function deleteBoard(board) {
	const boardTitle = board.querySelector('.board-title').value;
	board.remove();

	const boards = JSON.parse(localStorage.getItem('boards'));
	delete boards[boardTitle];

	localStorage.setItem('boards', JSON.stringify(boards));
}

/*
функція для чіпляння подій на taskи і їх елементи
*/
function touchTheEventOnTasksElements(tasksParent = null) {
	const tasks = tasksParent ?
		tasksParent.querySelectorAll('.task') :
		document.querySelectorAll('.task');

	tasks.forEach(task => {
		const taskContent = task.querySelector('.task-content');
		const taskMenu = task.querySelector('.task-menu');
		const taskMenuDoneButton = taskMenu.querySelector('.task-done-button');
		const taskMenuEditButton = task.querySelector('.task-edit-button');
		const taskMenuDeleteButton = taskMenu.querySelector('.task-delete-button');

		task.ondragstart = e => drag(e);

		taskMenuDoneButton.onclick = () => makeTask(task);

		taskMenuEditButton.onclick = () => editTask(task);

		taskMenuDeleteButton.onclick = () => deleteTask(task.id);

	})
}

/*
функція для виведення помилки
*/
function alertError(messagePart = 'feild') {
	alert(`Oops! It seems that ${messagePart} is empty.`);
}

/*
функція для чіпляння подій на елементи груп
*/
function touchTheEventsOnGroupsElements(groupsParent = null) {
	const groups = groupsParent ?
		groupsParent.querySelectorAll('.group') :
		document.querySelectorAll(".group");

	groups.forEach(group => {
		const groupContent = group.querySelector('.group-content');
		const groupFormForAddingTasks = group.querySelector('.add-new-task');
		const groupTitle = group.querySelector('.group-title');
		const groupTitleValue = groupTitle.value;

		groupContent.ondragover = e => e.preventDefault();
		groupContent.ondrop = e => drop(e);

		groupFormForAddingTasks.onsubmit = (e) => {
			e.preventDefault();
			if (groupFormForAddingTasks['task-text'].value) {
				const taskObject = {
					id: Date.now(),
					text: groupFormForAddingTasks['task-text'].value,
					status: false
				}
				groupFormForAddingTasks.previousElementSibling.insertAdjacentHTML('beforeend', createTask(taskObject));
				groupFormForAddingTasks['task-text'].value = '';
				touchTheEventOnTasksElements(groupFormForAddingTasks.previousElementSibling);
				createBoardObject(groupFormForAddingTasks.closest('.board'));
			} else {
				alertError('task');
			}
		}

		groupTitle.onchange = () => {
			groupTitle.value ?
				createBoardObject(group.closest('.board'))
				: (
					alertError('group title'),
					groupTitle.value = groupTitleValue
				)
		}
	})
}

/*
функція для чіплання подій на дошки і їх елементи
*/
function touchTheEventOnBoardsElements() {
	const boards = document.querySelectorAll('.board');

	boards.forEach(board => {
		const createGroupForm = board.querySelector('.create-group');
		const deleteBoardButton = board.querySelector('.board-delete-button');
		const boardTitle = board.querySelector('.board-title');
		const boardTitleValue = boardTitle.value;

		createGroupForm.onsubmit = (e) => {
			e.preventDefault();
			createGroupForm['group-name'].value ?
				(
					createGroupForm.insertAdjacentHTML('beforebegin', createGroup(createGroupForm['group-name'].value, Date.now())),
					touchTheEventsOnGroupsElements(createGroupForm.parentElement),
					createGroupForm['group-name'].value = '',
					createBoardObject(createGroupForm.closest('.board'))
				)
				:
				alertError('group title');
		}

		deleteBoardButton.onclick = () => deleteBoard(board);

		boardTitle.onchange = () => {
			const boards = JSON.parse(localStorage.getItem('boards'));
			delete boards[boardTitleValue];
			localStorage.setItem('boards', JSON.stringify(boards));

			createBoardObject(board);
		}
	})
}

/*
функція для створення об'єкта дошки і зберігання його у localStorage
*/
function createBoardObject(board) {
	const boardObject = {
		groups: {}
	};
	const groups = board.querySelectorAll(".group");

	boardObject.id = board.id;
	boardObject.boardName = board.querySelector('.board-title').value;

	groups.forEach(group => {
		const groupTitle = group.querySelector('.group-title').value;
		boardObject.groups[groupTitle] = {
			tasks: {},
			id: group.id
		};

		const tasks = group.querySelectorAll('.task');

		tasks.forEach(task => {
			const taskContent = task.querySelector('.task-content').innerText;
			const taskStatus = task.querySelector('.task-done-button').innerText;

			boardObject.groups[groupTitle].tasks[task.id] = {
				id: task.id,
				text: taskContent,
				status: taskStatus === 'Done' ? true : false
			};
		})
	})

	const boards = JSON.parse(localStorage.getItem('boards'));
	boards[board.querySelector('.board-title').value] = boardObject;

	localStorage.setItem('boards', JSON.stringify(boards));
}

window.addEventListener('load', () => {
	if (!localStorage.getItem('boards')) localStorage.setItem('boards', '{}');
	/*
	код для створення нової дошки
	*/
	const createBoardForm = document.forms['create-board'];
	createBoardForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const boardTitle = createBoardForm['board-name'].value;
		const boardId = Date.now();
		boardTitle ? (
			document.querySelector(".boards").insertAdjacentHTML('beforeend', createBoard(boardTitle, boardId)),
			touchTheEventOnBoardsElements(),
			createBoardObject(document.getElementById(boardId)),
			createBoardForm['board-name'].value = ''
		) :
			alertError('board title');
	});
	/*
	код який виводить уже існуючі дошки !(не завершений)
	*/
	const boards = JSON.parse(localStorage.getItem('boards'));
	if (Object.keys(boards).length) {
		Object.keys(boards).forEach(boardTitle => {
			document.querySelector('.boards').insertAdjacentHTML('afterbegin',
				createBoard(boardTitle, boards[boardTitle].id, boards[boardTitle].groups));
		})
	}


	touchTheEventOnBoardsElements();
	touchTheEventsOnGroupsElements();
	touchTheEventOnTasksElements();

	// createBoardObject(document.getElementById('4845318946464646'));

});

