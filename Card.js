// Task Card JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const dueDateElement = document.querySelector('[data-testid="test-todo-due-date"]');
    const timeRemainingElement = document.querySelector('[data-testid="test-todo-time-remaining"]');

    // Parse the due date from the datetime attribute
    const dueDate = new Date(dueDateElement.getAttribute('datetime'));

    function formatDueDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return 'Due ' + date.toLocaleDateString('en-US', options);
    }

    function formatTimeRemaining(targetDate) {
        const now = new Date();
        const diffMs = targetDate - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffMs < 0) {
            // Overdue
            const absDays = Math.abs(diffDays);
            const absHours = Math.abs(diffHours);
            if (absDays > 0) {
                return `Overdue by ${absDays} day${absDays > 1 ? 's' : ''}`;
            } else if (absHours > 0) {
                return `Overdue by ${absHours} hour${absHours > 1 ? 's' : ''}`;
            } else {
                return 'Overdue';
            }
        } else {
            // Due in future
            if (diffDays > 0) {
                return `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
            } else if (diffHours > 0) {
                return `Due in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
            } else if (diffMinutes > 0) {
                return `Due in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
            } else {
                return 'Due now';
            }
        }
    }

    function updateDates() {
        dueDateElement.textContent = formatDueDate(dueDate);
        timeRemainingElement.textContent = formatTimeRemaining(dueDate);
    }

    // Initial update
    updateDates();

    // Update every 30 seconds
    setInterval(updateDates, 30000);
});