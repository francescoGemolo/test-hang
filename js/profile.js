const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const cancelBtn = document.getElementById('cancelBtn');
const profileInfo = document.getElementById('profileInfo');
const profileActions = document.getElementById('profileActions');
const profileForm = document.getElementById('profileForm');

const deleteModal = document.getElementById('deleteModal');
const closeModalBtn = document.getElementById('closeModalBtn');

function enterEditMode() {
    profileInfo.style.display = 'none';
    profileActions.style.display = 'none';
    profileForm.style.display = 'flex';
}

function exitEditMode() {
    profileInfo.style.display = 'flex';
    profileActions.style.display = 'flex';
    profileForm.style.display = 'none';
}

editBtn.addEventListener('click', enterEditMode);
cancelBtn.addEventListener('click', exitEditMode);

deleteBtn.addEventListener('click', () => {
    deleteModal.classList.add('open');
});

closeModalBtn.addEventListener('click', () => {
    deleteModal.classList.remove('open');
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('open');
    }
});