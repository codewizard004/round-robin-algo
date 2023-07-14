const express = require('express');
const app = express();
const cors = require('cors');

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
app.use(express.json());

// Store teams and their members
const teams = {
    'team1': [
        { 'name': 'member 1', 'priority': 1 },
        { 'name': 'member 2', 'priority': 3 },
        { 'name': 'member 3', 'priority': 5 },
        { 'name': 'member 4', 'priority': 2 }
    ],
    'team2': [
        { 'name': 'member 5', 'priority': 4 },
        { 'name': 'member 6', 'priority': 2 },
        { 'name': 'member 7', 'priority': 7 },
        { 'name': 'member 8', 'priority': 6 }
    ],
    'team3': [
        { 'name': 'member 9', 'priority': 9 },
        { 'name': 'member 10', 'priority': 8 },
        { 'name': 'member 11', 'priority': 11 },
        { 'name': 'member 12', 'priority': 10 }
    ],
    'team4': [
        { 'name': 'member 16', 'priority': 12 },
        { 'name': 'member 13', 'priority': 13 },
        { 'name': 'member 15', 'priority': 14 },
        { 'name': 'member 17', 'priority': 15 }
    ]
};

// Initialize counters for each team
const teamCounters = {};

// Assign tasks to team members in round-robin manner
function assignTaskToTeam(reqTeams, task) {
    const filteredTeams = {};
    reqTeams.forEach(teamName => {
        if (teams.hasOwnProperty(teamName)) {
            filteredTeams[teamName] = teams[teamName];
        }
    });
    const allMembers = Object.values(filteredTeams).flat();
    const sortedMembers = allMembers.sort((a, b) => a.priority - b.priority);

    const assignedTasks = {};
    const teamIndexes = {};

    Object.keys(filteredTeams).forEach(team => {
        teamIndexes[team] = 0;
    });

    for (let i = 0; i < sortedMembers.length; i++) {
        const member = sortedMembers[i];
        const teamName = Object.keys(filteredTeams).find(team => filteredTeams[team].includes(member));
        const team = filteredTeams[teamName];
        const teamIndex = teamIndexes[teamName];

        if (!assignedTasks[member.name]) {
            assignedTasks[member.name] = [];
        }
        assignedTasks[member.name].push({
            team: teamName,
            task,
        });

        teamIndexes[teamName] = (teamIndex + 1) % team.length;
    }
    return assignedTasks;
}

// API endpoint for assigning a task
app.post('/assign-task', (req, res) => {
    const { task, teams } = req.body;
    const response = assignTaskToTeam(teams, task);
    res.send(response);
});

app.get('/teams', (req, res) => {
    res.send(Object.keys(teams));
});

// Start the server
app.listen(8000, () => {
    console.log('Server is running on port 8000.');
});
