const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

const fakeUsers = [
    'john_doe',
    'emma_wilson',
    'mike_jones',
    'sarah_smith',
    'alex_brown',
    'lisa_garcia',
    'david_lee',
    'rachel_white'
];

// Populate user list
const userList = document.getElementById('user-list');
fakeUsers.forEach(username => {
    const li = document.createElement('li');
    li.textContent = username;
    userList.appendChild(li);
});

// Like button functionality
let likeCount = 0;

const likeBtn = document.querySelector('#like-btn');
const likeCountDisplay = document.querySelector('#like-count');

likeBtn.addEventListener('click', function() {
    likeCount++;
    likeBtn.classList.add('liked');
    setTimeout(() => likeBtn.classList.remove('liked'), 300);
    
    likeCountDisplay.textContent = likeCount + (likeCount === 1 ? ' like' : ' likes');
});

// Like button functionality for second image
let likeCount2 = 0;

const likeBtn2 = document.querySelector('#like-btn-2');
const likeCountDisplay2 = document.querySelector('#like-count-2');

likeBtn2.addEventListener('click', function() {
    likeCount2++;
    likeBtn2.classList.add('liked');
    setTimeout(() => likeBtn2.classList.remove('liked'), 300);
    
    
    likeCountDisplay2.textContent = likeCount2 + (likeCount2 === 1 ? ' like' : ' likes');
});

// Toggle hide/show functionality for posts
const toggleButtons = document.querySelectorAll('.toggle-btn');

toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const postContent = document.getElementById(targetId);
        
        if (postContent.classList.contains('hidden')) {
            postContent.classList.remove('hidden');
            this.textContent = 'Hide';
        } else {
            postContent.classList.add('hidden');
            this.textContent = 'Show';
        }
    });
});