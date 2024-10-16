const stripe = Stripe('pk_test_51LDBauCCUJB0LhOk9vmqddtsfq0VJ0u7Q1U8mLpEB52oGKwqpQz13oGruBLcbNZKH5GYfNJ9nwushclmXaafaHL400ae3nmb3v');

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupCheckout();
    setupContactForm();
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function setupCheckout() {
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', function() {
        stripe.redirectToCheckout({
            lineItems: [{
                // Replace 'price_XXXXXXXXXXXXXXXXX' with your actual Price ID
                // You can find this in your Stripe Dashboard under Products > Your Product > Pricing
                price: 'price_XXXXXXXXXXXXXXXXX',
                quantity: 1,
            }],
            mode: 'subscription',
            successUrl: 'https://your-thebridge-domain.com/success',
            cancelUrl: 'https://your-thebridge-domain.com/canceled',
        })
        .then(function (result) {
            if (result.error) {
                console.error(result.error.message);
            }
        });
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your server
        console.log('Form submitted');
        alert('Thank you for your message. We\'ll get back to you soon!');
        contactForm.reset();
    });
}

function showUserDashboard(userData) {
    const main = document.querySelector('main');
    const userDashboard = document.getElementById('user-dashboard');
    main.classList.add('hidden');
    userDashboard.classList.remove('hidden');

    userDashboard.innerHTML = `
        <h2>Welcome, ${userData.name}!</h2>
        <div id="user-links"></div>
        <button id="add-link">Add New Link</button>
        <div id="analytics"></div>
    `;

    renderUserLinks(userData.links);
    setupAddLink();
    renderAnalytics(userData.analytics);
}

function renderUserLinks(links) {
    const userLinks = document.getElementById('user-links');
    userLinks.innerHTML = '';
    links.forEach(link => {
        const linkElement = document.createElement('div');
        linkElement.className = 'user-link';
        linkElement.innerHTML = `
            <a href="${link.url}" target="_blank">${link.title}</a>
            <button class="edit-link" data-id="${link.id}">Edit</button>
            <button class="delete-link" data-id="${link.id}">Delete</button>
        `;
        userLinks.appendChild(linkElement);
    });
    setupLinkActions();
}

function setupAddLink() {
    const addLinkButton = document.getElementById('add-link');
    addLinkButton.addEventListener('click', () => {
        // Here you would typically open a modal or form to add a new link
        console.log('Add new link');
    });
}

function setupLinkActions() {
    const editButtons = document.querySelectorAll('.edit-link');
    const deleteButtons = document.querySelectorAll('.delete-link');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const linkId = button.getAttribute('data-id');
            // Here you would typically open a modal or form to edit the link
            console.log('Edit link', linkId);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const linkId = button.getAttribute('data-id');
            // Here you would typically send a request to your server to delete the link
            console.log('Delete link', linkId);
        });
    });
}

function renderAnalytics(analytics) {
    const analyticsContainer = document.getElementById('analytics');
    analyticsContainer.innerHTML = `
        <h3>Your Analytics</h3>
        <p>Total Clicks: ${analytics.totalClicks}</p>
        <p>Unique Visitors: ${analytics.uniqueVisitors}</p>
    `;
}

// This function would be called after successful payment and user creation
function initializeUserDashboard() {
    // Fetch user data from your server
    fetch('/api/user-data')
        .then(response => response.json())
        .then(userData => {
            showUserDashboard(userData);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}