document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('subjects-tbody');
    const addBtn = document.getElementById('add-btn');
    const resetBtn = document.getElementById('reset-btn');

    let subjectCount = 0;

    // Create a new empty row in the attendance table
    function createRow() {
        subjectCount++;
        const rowId = `row-${Date.now()}`;

        const tr = document.createElement('tr');
        tr.id = rowId;
        tr.className = 'subject-row';

        tr.innerHTML = `
            <td>
                <input type="text" class="name-input" placeholder="Subject Name">
            </td>
            <td>
                <input type="number" class="total-input" min="0" placeholder="0">
            </td>
            <td>
                <input type="number" class="attended-input" min="0" placeholder="0">
            </td>
            <td class="percentage-cell">
                <span class="percentage-display badge-neutral">0%</span>
            </td>
            <td>
                <button class="btn-icon btn-danger remove-btn" aria-label="Delete subject" title="Delete">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </td>
        `;

        tbody.appendChild(tr);

        // Add event listeners for inputs
        const totalInput = tr.querySelector('.total-input');
        const attendedInput = tr.querySelector('.attended-input');

        const calcAndValidate = () => calculateRowPercentage(tr);

        // Recalculate individually on input
        totalInput.addEventListener('input', calcAndValidate);
        attendedInput.addEventListener('input', calcAndValidate);

        // Delete subject functionality
        const removeBtn = tr.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            tr.remove();
        });
    }

    // Process a single row and update its percentage
    function calculateRowPercentage(tr) {
        const totalInput = tr.querySelector('.total-input');
        const attendedInput = tr.querySelector('.attended-input');
        const percentageDisplay = tr.querySelector('.percentage-display');

        let total = parseInt(totalInput.value, 10);
        let attended = parseInt(attendedInput.value, 10);

        // Reset styling
        totalInput.classList.remove('input-error');
        attendedInput.classList.remove('input-error');

        // Allow blank logic basically equal to zero calculation internally
        if (isNaN(total) || total < 0) total = 0;
        if (isNaN(attended) || attended < 0) attended = 0;

        // Validation rule: attended <= total
        if (attended > total && total > 0) {
            attendedInput.classList.add('input-error');
            percentageDisplay.textContent = 'Error';
            percentageDisplay.className = 'percentage-display badge-error';
            return { total: 0, attended: 0, valid: false, percentage: 0 };
        }

        // Logic
        let percentage = 0;
        if (total > 0) {
            percentage = (attended / total) * 100;
        }

        // Output Display logic
        if (total === 0) { // If no classes, neutral
            percentageDisplay.textContent = '0%';
            percentageDisplay.className = 'percentage-display badge-neutral';
            return { total: 0, attended: 0, valid: true, percentage: 0 };
        }

        const formattedPercentage = percentage.toFixed(1) + '%';
        percentageDisplay.textContent = formattedPercentage;

        if (percentage >= 75) {
            percentageDisplay.className = 'percentage-display badge-success';
        } else {
            percentageDisplay.className = 'percentage-display badge-danger';
        }

        return { total, attended, valid: true, percentage };
    }

    // Initialize with one empty row
    createRow();

    // Add subject button listener
    addBtn.addEventListener('click', () => {
        createRow();
    });

    // Reset everything listener
    resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all data and start fresh?")) {
            tbody.innerHTML = '';
            subjectCount = 0;
            createRow(); // Creates one fresh empty row
        }
    });

});
