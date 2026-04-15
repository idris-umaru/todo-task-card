document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('[data-testid="test-todo-card"]');
  const dueDateElement = document.querySelector('[data-testid="test-todo-due-date"]');
  const timeRemainingElement = document.querySelector('[data-testid="test-todo-time-remaining"]');
  const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
  const titleElement = document.querySelector('[data-testid="test-todo-title"]');
  const descriptionElement = document.querySelector('[data-testid="test-todo-description"]');
  const collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
  const expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
  const statusDisplay = document.querySelector('[data-testid="test-todo-status"]');
  const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
  const priorityBadge = document.querySelector('[data-testid="test-todo-priority"]');
  const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
  const completeToggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
  const editButton = document.querySelector('[data-testid="test-todo-edit-button"]');
  const deleteButton = document.querySelector('[data-testid="test-todo-delete-button"]');
  const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
  const titleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
  const descriptionInput = document.querySelector('[data-testid="test-todo-edit-description-input"]');
  const priorityInput = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
  const dueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
  const saveButton = document.querySelector('[data-testid="test-todo-save-button"]');
  const cancelButton = document.querySelector('[data-testid="test-todo-cancel-button"]');

  const COLLAPSE_THRESHOLD = 100;
  const TIMER_INTERVAL_MS = 45000;
  let openInterval = null;
  let isExpanded = false;
  let savedState = null;

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const state = {
    title: titleElement.textContent.trim(),
    description: descriptionElement.textContent.trim(),
    priority: priorityBadge.textContent.trim(),
    status: statusDisplay.textContent.trim(),
    dueDate: new Date(dueDateElement.getAttribute('datetime')),
  };

  function toDateTimeLocal(date) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  function formatDueDate(date) {
    return `Due ${dateFormatter.format(date)}`;
  }

  function formatTimeRemaining(target) {
    const now = new Date();
    const diffMs = target - now;
    const absMs = Math.abs(diffMs);
    const minutes = Math.floor(absMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (diffMs < 0) {
      if (days > 0) {
        return `Overdue by ${days} day${days === 1 ? '' : 's'}`;
      }
      if (hours > 0) {
        return `Overdue by ${hours} hour${hours === 1 ? '' : 's'}`;
      }
      if (minutes > 0) {
        return `Overdue by ${minutes} minute${minutes === 1 ? '' : 's'}`;
      }
      return 'Overdue';
    }

    if (days > 0) {
      return `Due in ${days} day${days === 1 ? '' : 's'}`;
    }
    if (hours > 0) {
      return `Due in ${hours} hour${hours === 1 ? '' : 's'}`;
    }
    if (minutes > 0) {
      return `Due in ${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    return 'Due now';
  }

  function updateDueDate() {
    dueDateElement.textContent = formatDueDate(state.dueDate);
    dueDateElement.setAttribute('datetime', state.dueDate.toISOString().slice(0, 19));
  }

  function syncStateClasses() {
    card.classList.toggle('done', state.status === 'Done');
    card.classList.toggle('in-progress', state.status === 'In Progress');
    card.classList.toggle('pending', state.status === 'Pending');
    card.classList.toggle('priority-low', state.priority === 'Low');
    card.classList.toggle('priority-medium', state.priority === 'Medium');
    card.classList.toggle('priority-high', state.priority === 'High');
    card.classList.toggle('overdue', state.status !== 'Done' && state.dueDate < new Date());
  }

  function refreshDescription() {
    const shouldCollapse = state.description.length > COLLAPSE_THRESHOLD;
    collapsibleSection.classList.toggle('collapsed', shouldCollapse && !isExpanded);
    expandToggle.hidden = !shouldCollapse;
    expandToggle.textContent = isExpanded ? 'Collapse description' : 'Show full description';
    expandToggle.setAttribute('aria-expanded', String(isExpanded));
  }

  function refreshTime() {
    if (state.status === 'Done') {
      timeRemainingElement.textContent = 'Completed';
      overdueIndicator.hidden = true;
      timeRemainingElement.classList.remove('time-remaining-overdue');
      return;
    }

    const now = new Date();
    const overdue = state.dueDate < now;
    const formatted = formatTimeRemaining(state.dueDate);
    timeRemainingElement.textContent = formatted;
    overdueIndicator.hidden = !overdue;
    overdueIndicator.textContent = overdue ? 'Overdue' : '';
    timeRemainingElement.classList.toggle('time-remaining-overdue', overdue);
  }

  function refreshPriority() {
    priorityBadge.textContent = state.priority;
    priorityBadge.setAttribute('aria-label', `Priority: ${state.priority}`);
    if (state.priority === 'Low') {
      priorityBadge.classList.add('priority-low');
      priorityBadge.classList.remove('priority-medium', 'priority-high');
    } else if (state.priority === 'Medium') {
      priorityBadge.classList.add('priority-medium');
      priorityBadge.classList.remove('priority-low', 'priority-high');
    } else {
      priorityBadge.classList.add('priority-high');
      priorityBadge.classList.remove('priority-low', 'priority-medium');
    }
  }

  function refreshStatus() {
    statusDisplay.textContent = state.status;
    statusDisplay.setAttribute('aria-label', `Status: ${state.status}`);
    statusControl.value = state.status;
    completeToggle.checked = state.status === 'Done';
  }

  function updateCardState() {
    titleElement.textContent = state.title;
    descriptionElement.textContent = state.description;
    updateDueDate();
    refreshPriority();
    refreshStatus();
    syncStateClasses();
    refreshDescription();
    refreshTime();
  }

  function scheduleTimer() {
    if (openInterval) return;
    openInterval = setInterval(() => {
      if (state.status !== 'Done') {
        refreshTime();
      }
    }, TIMER_INTERVAL_MS);
  }

  function stopTimer() {
    if (!openInterval) return;
    clearInterval(openInterval);
    openInterval = null;
  }

  function setStatus(newStatus) {
    if (newStatus === 'Done') {
      state.status = 'Done';
    } else if (completeToggle.checked && newStatus !== 'Done') {
      state.status = newStatus;
    } else {
      state.status = newStatus;
    }

    if (state.status === 'Done') {
      stopTimer();
    } else {
      scheduleTimer();
    }
    updateCardState();
  }

  function openEditForm() {
    savedState = { ...state };
    titleInput.value = state.title;
    descriptionInput.value = state.description;
    priorityInput.value = state.priority;
    dueDateInput.value = toDateTimeLocal(state.dueDate);
    editForm.hidden = false;
    editButton.setAttribute('aria-expanded', 'true');
    titleInput.focus();
  }

  function closeEditForm() {
    editForm.hidden = true;
    editButton.setAttribute('aria-expanded', 'false');
    editButton.focus();
  }

  function saveEditForm() {
    const nextTitle = titleInput.value.trim();
    if (!nextTitle) {
      titleInput.focus();
      return;
    }

    const nextDescription = descriptionInput.value.trim();
    const nextPriority = priorityInput.value;
    const nextDueDate = new Date(dueDateInput.value);

    if (isNaN(nextDueDate.getTime())) {
      dueDateInput.focus();
      return;
    }

    state.title = nextTitle;
    state.description = nextDescription;
    state.priority = nextPriority;
    state.dueDate = nextDueDate;
    if (state.status !== 'Done') {
      scheduleTimer();
    }
    updateCardState();
    closeEditForm();
  }

  function cancelEditForm() {
    if (savedState) {
      Object.assign(state, savedState);
      updateCardState();
    }
    closeEditForm();
  }

  completeToggle.addEventListener('change', () => {
    if (completeToggle.checked) {
      setStatus('Done');
    } else if (state.status === 'Done') {
      setStatus('Pending');
    }
  });

  statusControl.addEventListener('change', (event) => {
    setStatus(event.target.value);
  });

  expandToggle.addEventListener('click', () => {
    isExpanded = !isExpanded;
    refreshDescription();
  });

  editButton.addEventListener('click', openEditForm);
  saveButton.addEventListener('click', saveEditForm);
  cancelButton.addEventListener('click', cancelEditForm);
  deleteButton.addEventListener('click', () => {
    if (card) {
      card.remove();
    }
  });

  editForm.addEventListener('keydown', (event) => {
    const focusable = Array.from(
      editForm.querySelectorAll('input, textarea, select, button')
    ).filter((element) => !element.disabled);
    if (event.key !== 'Tab' || focusable.length === 0) return;

    const currentIndex = focusable.indexOf(document.activeElement);
    if (event.shiftKey) {
      if (currentIndex === 0) {
        focusable[focusable.length - 1].focus();
        event.preventDefault();
      }
    } else {
      if (currentIndex === focusable.length - 1) {
        focusable[0].focus();
        event.preventDefault();
      }
    }
  });

  updateCardState();
  scheduleTimer();
});
