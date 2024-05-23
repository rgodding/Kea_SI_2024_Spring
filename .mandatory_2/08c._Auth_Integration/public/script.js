// Initialize Auth0 client

let auth0Client;

async function login() {
    await auth0Client.loginWithRedirect();
}

async function logout() {
    await auth0Client.logout();
}

async function checkLoggedIn() {
    const isLoggedInBox = document.getElementById('loggedIn');
    const isLogged = await auth0Client.isAuthenticated();
    isLoggedInBox.innerHTML = isLogged ? 'Yes' : 'No'
}


async function initializeAuth0() {
    auth0Client = await createAuth0Client({
        domain: 'dev-kb8j7ed6vluw7xt4.eu.auth0.com',
        client_id: 'ZBU7VkCpYrVwFGdZ8q1TEnE51qMThj0h',
        redirect_uri: 'http://localhost:3000/'
    });
    if (window.location.search.includes('code=')) {
        // Process the callback data from Auth0
        await auth0Client.handleRedirectCallback();
        
        // Update the URL to remove the 'code' parameter
        window.history.replaceState({}, document.title, '/');
    }
}

initializeAuth0();
