document.addEventListener('DOMContentLoaded', () => {
  const dueDateElement = document.querySelector('[data-testid="test-todo-due-date"]');
  const timeRemainingElement = document.querySelector('[data-testid="test-todo-time-remaining"]');
  const titleElement = document.querySelector('[data-testid="test-todo-title"]');
  const descriptionElement = document.querySelector('[data-testid="test-todo-description"]');
  const editButton = document.querySelector('[data-testid="test-todo-edit-button"]');
  const deleteButton = document.querySelector('[data-testid="test-todo-delete-button"]');
  const card = document.querySelector('[data-testid="test-todo-card"]');
  const dueDate = new Date(dueDateElement.getAttribute('datetime'));

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

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

  function refresh() {
    dueDateElement.textContent = formatDueDate(dueDate);
    timeRemainingElement.textContent = formatTimeRemaining(dueDate);
  }

  function updateContent() {
    const newTitle = prompt('Edit task title', titleElement.textContent.trim());
    if (newTitle !== null && newTitle.trim() !== '') {
      titleElement.textContent = newTitle.trim();
    }

    const newDescription = prompt('Edit task description', descriptionElement.textContent.trim());
    if (newDescription !== null && newDescription.trim() !== '') {
      descriptionElement.textContent = newDescription.trim();
    }
  }

  function removeCard() {
    if (card) {
      card.remove();
    }
  }

  editButton.addEventListener('click', updateContent);
  deleteButton.addEventListener('click', removeCard);

  refresh();
  setInterval(refresh, 30000);
});
