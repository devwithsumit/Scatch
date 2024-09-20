document.addEventListener('DOMContentLoaded', function () {
    var flashMessage = document.getElementById('flash-message');
    if (flashMessage) {
        setTimeout(function () {
            flashMessage.classList.add('fade-out');
            // Optional: Remove the message after fade-out
            setTimeout(function () {
                flashMessage.style.display = 'none';
            }, 500); // Matches the duration of the fade-out transition
        }, 3000); // Time in milliseconds before message starts fading out
    }
});