let currentAppId = null;

async function fetchApplications() {
    const response = await fetch('/applications');
    return response.json();
}

async function addApplication() {
    const appName = document.getElementById('appName').value;
    const newApp = { id: Date.now().toString(), name: appName, sanitySteps: [], issues: [], crNames: [] };
    
    if (appName) {
        await fetch('/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newApp)
        });
        loadApplications(); // Refresh the dropdown
        alert("Application added successfully!");
        document.getElementById('appName').value = ''; // Clear input
    } else {
        alert("Please enter an application name.");
    }
}

async function loadApplications() {
    const applications = await fetchApplications();
    const appDropdown = document.getElementById('appDropdown');
    appDropdown.innerHTML = '<option value="">Select an Application</option>'; // Clear existing options
    applications.forEach(app => {
        const option = document.createElement('option');
        option.value = app.id;
        option.textContent = app.name;
        appDropdown.appendChild(option);
    });
}

async function loadApplicationDetails() {
    const appId = document.getElementById('appDropdown').value;
    if (!appId) {
        document.getElementById('appDetails').style.display = 'none';
        return;
    }

    currentAppId = appId;
    const applications = await fetchApplications();
    const app = applications.find(app => app.id === currentAppId);
    document.getElementById('appDetails').style.display = 'block';

    // Hide all sections initially
    document.getElementById('sanitySection').style.display = 'none';
    document.getElementById('issuesSection').style.display = 'none';
    document.getElementById('crSection').style.display = 'none';

    // Load the initial data
    loadSanitySteps(app);
    loadIssues(app);
    loadCRNames(app);
}

function showSection(section) {
    document.getElementById('sanitySection').style.display = section === 'sanity' ? 'block' : 'none';
    document.getElementById('issuesSection').style.display = section === 'issues' ? 'block' : 'none';
    document.getElementById('crSection').style.display = section === 'cr' ? 'block' : 'none';
}

function loadSanitySteps(app) {
    const sanityList = document.getElementById('sanityList');
    sanityList.innerHTML = '';
    app.sanitySteps.forEach((step, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = step;

        const buttonsDiv = document.createElement('div');
        
        const updateButton = document.createElement('button');
        updateButton.className = 'btn btn-warning btn-sm';
        updateButton.textContent = 'Update';
        updateButton.onclick = () => updateSanityStep(index);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm ml-2';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteSanityStep(index);
        
        buttonsDiv.appendChild(updateButton);
        buttonsDiv.appendChild(deleteButton);
        
        li.appendChild(buttonsDiv);
        sanityList.appendChild(li);
    });
}

function loadIssues(app) {
    const issueList = document.getElementById('issueList');
    issueList.innerHTML = '';
    app.issues.forEach((issue, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = issue;

        const buttonsDiv = document.createElement('div');
        
        const updateButton = document.createElement('button');
        updateButton.className = 'btn btn-warning btn-sm';
        updateButton.textContent = 'Update';
        updateButton.onclick = () => updateIssue(index);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm ml-2';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteIssue(index);
        
        buttonsDiv.appendChild(updateButton);
        buttonsDiv.appendChild(deleteButton);
        
        li.appendChild(buttonsDiv);
        issueList.appendChild(li);
    });
}

function loadCRNames(app) {
    const crList = document.getElementById('crList');
    crList.innerHTML = '';
    app.crNames.forEach((cr, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = cr;

        const buttonsDiv = document.createElement('div');
        
        const updateButton = document.createElement('button');
        updateButton.className = 'btn btn-warning btn-sm';
        updateButton.textContent = 'Update';
        updateButton.onclick = () => updateCRName(index);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm ml-2';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteCRName(index);
        
        buttonsDiv.appendChild(updateButton);
        buttonsDiv.appendChild(deleteButton);
        
        li.appendChild(buttonsDiv);
        crList.appendChild(li);
    });
}

// Functions to add entries
async function addSanityStep() {
    const step = document.getElementById('sanityStep').value;
    if (step && currentAppId) {
        const applications = await fetchApplications();
        const app = applications.find(app => app.id === currentAppId);
        app.sanitySteps.push(step);
        await saveApplications(applications);
        loadSanitySteps(app);
        document.getElementById('sanityStep').value = ''; // Clear input
    }
}

async function addIssue() {
    const issue = document.getElementById('issueName').value;
    if (issue && currentAppId) {
        const applications = await fetchApplications();
        const app = applications.find(app => app.id === currentAppId);
        app.issues.push(issue);
        await saveApplications(applications);
        loadIssues(app);
        document.getElementById('issueName').value = ''; // Clear input
    }
}

async function addCRName() {
    const cr = document.getElementById('crName').value;
    if (cr && currentAppId) {
        const applications = await fetchApplications();
        const app = applications.find(app => app.id === currentAppId);
        app.crNames.push(cr);
        await saveApplications(applications);
        loadCRNames(app);
        document.getElementById('crName').value = ''; // Clear input
    }
}

// Functions to update entries
async function updateSanityStep(index) {
    const newStep = prompt("Enter new Sanity Step:");
    if (newStep && currentAppId) {
        const applications = await fetchApplications();
        const app = applications.find(app => app.id === currentAppId);
        app.sanitySteps[index] = newStep;
        await saveApplications(applications);
        loadSanitySteps(app);
    }
}

async function updateIssue(index) {
    const newIssue = prompt("Enter new Issue:");
    if (newIssue && currentAppId) {
        const applications = await fetchApplications();
        const app = applications.find(app => app.id === currentAppId);
        app.issues[index] = newIssue;
        await saveApplications(applications);
        loadIssues(app);
    }
}

async function updateCRName(index) {
    const newCR = prompt("Enter new CR Name:");
    if (newCR && currentAppId) {
        const applications = await fetchApplications();
        const app = applications.find(app => app.id === currentAppId);
        app.crNames[index] = newCR;
        await saveApplications(applications);
        loadCRNames(app);
    }
}

// Functions to delete entries
async function deleteSanityStep(index) {
    if (currentAppId) {
        const applications = await fetchApplications();
        const app = applications.find(app => app.id === currentAppId);
        app.sanitySteps.splice(index, 1);
        await saveApplications(applications);
        loadSanitySteps(app);
    }
}

async function deleteIssue(index) {
    if (currentAppId) {
        const applications = await fetchApplications();
        const app = applications.find(app => app.id === currentAppId);
        app.issues.splice(index, 1);
        await saveApplications(applications);
        loadIssues(app);
    }
}

async function deleteCRName(index) {
    if (currentAppId) {
        const applications = await fetchApplications();
        const app = applications.find(app => app.id === currentAppId);
        app.crNames.splice(index, 1);
        await saveApplications(applications);
        loadCRNames(app);
    }
}

// Save applications to server
async function saveApplications(applications) {
    await fetch('/applications', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(applications)
    });
}

// Load applications on page load
document.addEventListener('DOMContentLoaded', loadApplications);

