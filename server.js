const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from the root directory

const textFilePath = path.join(__dirname, 'data', 'applications.txt');

// Function to read applications from the text file
function readApplications() {
    if (fs.existsSync(textFilePath)) {
        const data = fs.readFileSync(textFilePath, 'utf8');
        return data.split('\n').filter(Boolean).map(line => JSON.parse(line));
    }
    return [];
}

// Function to write applications to the text file
function writeApplications(applications) {
    const data = applications.map(app => JSON.stringify(app)).join('\n');
    fs.writeFileSync(textFilePath, data);
}

// Endpoint to get applications
app.get('/applications', (req, res) => {
    const applications = readApplications();
    res.send(applications);
});

// Endpoint to add an application
app.post('/applications', (req, res) => {
    const applications = readApplications();
    applications.push(req.body);
    writeApplications(applications);
    res.sendStatus(200);
});

// Endpoint to delete an application
app.delete('/applications/:id', (req, res) => {
    let applications = readApplications();
    applications = applications.filter(app => app.id !== req.params.id);
    writeApplications(applications);
    res.sendStatus(200);
});

// Endpoint to modify an application
app.put('/applications/:id', (req, res) => {
    const applications = readApplications();
    const index = applications.findIndex(app => app.id === req.params.id);
    if (index !== -1) {
        applications[index] = { ...applications[index], ...req.body };
        writeApplications(applications);
        res.sendStatus(200);
    } else {
        res.status(404).send('Application not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

