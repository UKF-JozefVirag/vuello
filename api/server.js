var express = require('express');
var app = express();
var fs = require('fs');
var cors = require('cors'); // Import the 'cors' module
app.use(express.json());
app.use(cors()); // Use the 'cors' middleware

app.get('/workspaces', function(req, res){
    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }
        console.log(data);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(data);
    });
});

// Endpoint to Get details of a specific workspace
app.get('/workspaces/:workspaceId', function(req, res){
    var workspaceId = req.params.workspaceId;

    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }

        var jsonData = JSON.parse(data);
        var workspace = jsonData.workspaces.find(function(workspace) {
            return workspace.id === Number(workspaceId);
        });

        if (!workspace) {
            res.status(404).send("Workspace not found");
            return;
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(workspace));
    });
});



app.post('/', function(req, res){
    var newWorkspace = req.body;

    newWorkspace.id = getLastWorkspaceId() + 1;

    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }
        // if there is not selected any background, choose bg-2 as default
        if (!newWorkspace.color) {
            newWorkspace.color = "bg-2";
        }
        console.log(newWorkspace)

        var jsonData = JSON.parse(data);
        jsonData.workspaces.push(newWorkspace);


        var updatedData = JSON.stringify(jsonData, null, 2);

        fs.writeFile(__dirname + "/" + "db.json", JSON.stringify(jsonData, null, 2), 'utf8', function (err) {
            if (err) {
                console.error("Error writing file:", err);
                res.status(500).send("Error writing data");
                return;
            }

            res.status(201).send("Workspace created successfully");
        });
    });
});


// Endpoint for creating card
app.post('/workspaces/:workspaceId/cards', function(req, res){
    var workspaceId = req.params.workspaceId;
    var newCard = req.body;

    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }

        var jsonData = JSON.parse(data);
        var workspace = jsonData.workspaces.find(function(workspace) {
            return workspace.id === Number(workspaceId);
        });

        if (!workspace) {
            res.status(404).send("Workspace not found");
            return;
        }

        workspace.cards.push(newCard);

        // Teraz aktualizujte súbor db.json s aktualizovanými dátami
        fs.writeFile(__dirname + "/" + "db.json", JSON.stringify(jsonData, null, 2), 'utf8', function(writeErr) {
            if (writeErr) {
                console.error("Error writing file:", writeErr);
                res.status(500).send("Error writing data");
                return;
            }

            // Všetko prebehlo úspešne, pošlite odpoveď s HTTP kódom 201
            res.status(201).send("Card created successfully");
        });
    });
});


// Endpoint for creating task
app.post('/workspaces/:workspaceId/cards/:cardId/tasks', function(req, res){
    var workspaceId = req.params.workspaceId;
    var cardId = req.params.cardId;
    var newTask = req.body;

    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }

        var jsonData = JSON.parse(data);

        var maxTaskId = jsonData.workspaces.reduce((maxId, workspace) => {
            return workspace.cards.reduce((maxId, card) => {
                return card.tasks.reduce((maxId, task) => Math.max(maxId, task.id), maxId);
            }, maxId);
        }, 0);

        // finding workspace
        var workspace = jsonData.workspaces.find(function(workspace) {
            return workspace.id === Number(workspaceId);
        });

        //
        if (!workspace) {
            console.error("Workspace not found");
            res.status(404).send("Workspace not found");
            return;
        }

        // finding card
        var card = workspace.cards.find(function(card) {
            return card.id === Number(cardId);
        });

        //
        if (!card) {
            console.error("Card not found");
            res.status(404).send("Card not found");
            return;
        }

        //
        var newTaskWithId = {
            id: maxTaskId + 1,
            name: newTask.name  // nazov ulohy z requestu
        };
        console.log(req.body);

        card.tasks.push(newTaskWithId);

        fs.writeFile(__dirname + "/" + "db.json", JSON.stringify(jsonData, null, 2), 'utf8', function(err) {
            if (err) {
                console.error("Error writing file:", err);
                res.status(500).send("Error writing data");
                return;
            }
            console.log("Data written successfully");
            res.status(201).send("Task created successfully");
        });
    });
});

app.delete('/workspaces/:workspaceId', function(req, res){
    var workspaceId = req.params.workspaceId;

    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }

        var jsonData = JSON.parse(data);
        var workspaceIndex = jsonData.workspaces.findIndex(function(workspace) {
            return workspace.id === Number(workspaceId);
        });

        if (workspaceIndex === -1) {
            res.status(404).send("Workspace not found");
            return;
        }

        jsonData.workspaces.splice(workspaceIndex, 1);

        fs.writeFile(__dirname + "/" + "db.json", JSON.stringify(jsonData, null, 2), 'utf8', function(err) {
            if (err) {
                console.error("Error writing file:", err);
                res.status(500).send("Error writing data");
                return;
            }
            console.log("Data written successfully");
            res.status(200).send("Workspace deleted successfully");
        });
    });
});

app.delete('/workspaces/:workspaceId/cards/:cardId', function(req, res){
    var workspaceId = req.params.workspaceId;
    var cardId = req.params.cardId;

    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }

        var jsonData = JSON.parse(data);
        var workspace = jsonData.workspaces.find(function(workspace) {
            return workspace.id === Number(workspaceId);
        });

        if (!workspace) {
            res.status(404).send("Workspace not found");
            return;
        }

        var cardIndex = workspace.cards.findIndex(function(card) {
            return card.id === Number(cardId);
        });

        if (cardIndex === -1) {
            res.status(404).send("Card not found");
            return;
        }

        workspace.cards.splice(cardIndex, 1);

        fs.writeFile(__dirname + "/" + "db.json", JSON.stringify(jsonData, null, 2), 'utf8', function(err) {
            if (err) {
                console.error("Error writing file:", err);
                res.status(500).send("Error writing data");
                return;
            }
            console.log("Data written successfully");
            res.status(200).send("Card deleted successfully");
        });
    });
});

app.delete('/workspaces/:workspaceId/cards/:cardId/tasks/:taskId', function(req, res){
    var workspaceId = req.params.workspaceId;
    var cardId = req.params.cardId;
    var taskId = req.params.taskId;

    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }

        var jsonData = JSON.parse(data);
        var workspace = jsonData.workspaces.find(function(workspace) {
            return workspace.id === Number(workspaceId);
        });

        if (!workspace) {
            res.status(404).send("Workspace not found");
            return;
        }

        var card = workspace.cards.find(function(card) {
            return card.id === Number(cardId);
        });

        if (!card) {
            res.status(404).send("Card not found");
            return;
        }

        var taskIndex = card.tasks.findIndex(function(task) {
            return task.id === Number(taskId);
        });

        if (taskIndex === -1) {
            res.status(404).send("Task not found");
            return;
        }

        card.tasks.splice(taskIndex, 1);

        fs.writeFile(__dirname + "/" + "db.json", JSON.stringify(jsonData, null, 2), 'utf8', function(err) {
            if (err) {
                console.error("Error writing file:", err);
                res.status(500).send("Error writing data");
                return;
            }
            console.log("Data written successfully");
            res.status(200).send("Task deleted successfully");
        });
    });
});


app.put('/workspaces/:workspaceId', function(req, res){
    var workspaceId = req.params.workspaceId;
    var updatedWorkspace = req.body;

    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }

        var jsonData = JSON.parse(data);
        var workspaceIndex = jsonData.workspaces.findIndex(function(workspace) {
            return workspace.id === Number(workspaceId);
        });

        if (workspaceIndex === -1) {
            res.status(404).send("Workspace not found");
            return;
        }

        jsonData.workspaces[workspaceIndex] = updatedWorkspace;

        fs.writeFile(__dirname + "/" + "db.json", JSON.stringify(jsonData, null, 2), 'utf8', function(err) {
            if (err) {
                console.error("Error writing file:", err);
                res.status(500).send("Error writing data");
                return;
            }
            console.log("Data written successfully");
            res.status(200).send("Workspace updated successfully");
        });
    });
});


app.put('/workspaces/:workspaceId/cards/:cardId', function(req, res){
    var workspaceId = req.params.workspaceId;
    var cardId = req.params.cardId;
    var updatedCard = req.body;

    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }

        var jsonData = JSON.parse(data);
        var workspace = jsonData.workspaces.find(function(workspace) {
            return workspace.id === Number(workspaceId);
        });

        if (!workspace) {
            res.status(404).send("Workspace not found");
            return;
        }

        var cardIndex = workspace.cards.findIndex(function(card) {
            return card.id === Number(cardId);
        });

        if (cardIndex === -1) {
            res.status(404).send("Card not found");
            return;
        }

        workspace.cards[cardIndex] = updatedCard;

        fs.writeFile(__dirname + "/" + "db.json", JSON.stringify(jsonData, null, 2), 'utf8', function(err) {
            if (err) {
                console.error("Error writing file:", err);
                res.status(500).send("Error writing data");
                return;
            }
            console.log("Data written successfully");
            res.status(200).send("Card updated successfully");
        });
    });
});

app.put('/workspaces/:workspaceId/cards/:cardId/tasks/:taskId', function(req, res){
    var workspaceId = req.params.workspaceId;
    var cardId = req.params.cardId;
    var taskId = req.params.taskId;
    var updatedTask = req.body;

    fs.readFile(__dirname + "/" + "db.json", 'utf8', function(err, data){
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading data");
            return;
        }

        var jsonData = JSON.parse(data);
        var workspace = jsonData.workspaces.find(function(workspace) {
            return workspace.id === Number(workspaceId);
        });

        if (!workspace) {
            res.status(404).send("Workspace not found");
            return;
        }

        var card = workspace.cards.find(function(card) {
            return card.id === Number(cardId);
        });

        if (!card) {
            res.status(404).send("Card not found");
            return;
        }

        var taskIndex = card.tasks.findIndex(function(task) {
            return task.id === Number(taskId);
        });

        if (taskIndex === -1) {
            res.status(404).send("Task not found");
            return;
        }

        card.tasks[taskIndex] = updatedTask;

        fs.writeFile(__dirname + "/" + "db.json", JSON.stringify(jsonData, null, 2), 'utf8', function(err) {
            if (err) {
                console.error("Error writing file:", err);
                res.status(500).send("Error writing data");
                return;
            }
            console.log("Data written successfully");
            res.status(200).send("Task updated successfully");
        });
    });
});

function getLastWorkspaceId() {
    const data = fs.readFileSync(__dirname + "/" + "db.json", 'utf8');
    const jsonData = JSON.parse(data);

    if (jsonData.workspaces.length === 0) {
        return 0; // Nulové ID, ak neexistujú žiadne workspaces
    }

    // Nájdite maximálne ID medzi existujúcimi workspaces
    const lastId = jsonData.workspaces.reduce((maxId, workspace) => {
        return Math.max(maxId, workspace.id);
    }, 0);

    return lastId;
}

var server = app.listen(9000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("REST API demo app listening at http://%s:%s", host, port);
});
