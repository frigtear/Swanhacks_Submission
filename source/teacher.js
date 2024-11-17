class Client {
    static socket = null;
    static isConnected = false;
    static most_recent_response = null;
    static server_address = "ws://3.147.205.233/";

    static async connect() {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.server_address);

            this.socket.onopen = () => {
                console.log("Connected to server");
                this.isConnected = true;
                resolve();
            };

            this.socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                this.isConnected = false;
                reject(error);
            };

            this.socket.onclose = () => {
                console.log("Connection closed");
                this.isConnected = false;
            };

            this.socket.onmessage = (event) => {
                this.most_recent_response = JSON.parse(event.data);
            };
        });
    }


    static send_message(message) {
        if (this.isConnected) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error("Cannot send message, not connected to server");
        }
    }

    static disconnect() {
        if (this.isConnected) {
            this.socket.close();
        }
    }

    static checkConnection() {
        return this.isConnected;
    }

    static getMostRecentResponse() {
        return this.most_recent_response;
    }
}

function request_students() {
    return [
        { "Name": "Reuben","Id": 1,"has_hat": false,"is_alive": true, "hat_button_text": "Give Pet Hat","kill_text": "Kill Pet","isLoading": false},
        { "Name": "Gerald","Id": 1,"has_hat": false,"is_alive": true, "hat_button_text": "Give Pet Hat","kill_text": "Kill Pet","isLoading": false},
        { "Name": "Martin","Id": 1,"has_hat": false,"is_alive": true, "hat_button_text": "Give Pet Hat","kill_text": "Kill Pet","isLoading": false},
        { "Name": "Jacob","Id": 1,"has_hat": false,"is_alive": true, "hat_button_text": "Give Pet Hat","kill_text": "Kill Pet","isLoading": false},
    ]
}

async function send_hat_change_request(student) {
    if (!Client.checkConnection()){
        await Client.connect()
    }

    Client.send_message({
        "Type": "Order",
        "Action": "Hat_change",
        "Student": student.Name
    });
}

async function send_kill_request(student) {
    if (!Client.checkConnection()){
        await Client.connect()
    }

    Client.send_message({
        "Type": "Order",
        "Action": "Kill_order",
        "Student": student.Name
    });
}

async function change_hat(student) {
    console.log("changing hat status of student " + student.Name);

    if (!Client.checkConnection()){
        await Client.connect()
    }

    if (!student.is_alive) {
        return;
    }

    student.isLoading = true;

    if (!student.has_hat) {
        student.hat_button_text = "Adding hat...";
        await send_hat_change_request(student);
        student.has_hat = true;
        student.hat_button_text = "Remove Hat";
    } else {
        student.hat_button_text = "Removing hat...";
        await send_hat_change_request(student);
        student.has_hat = false;
        student.hat_button_text = "Give Hat";
    }

    student.isLoading = false;
}

async function kill_pet(student) {
    if (!student.is_alive) {
        return;
    }

    console.log("killing pet of " + student.Name);
    student.isLoading = true;

    if (!student.is_alive) {
        student.kill_text = "Grieving...";
    } else {
        student.kill_text = "Killing pet...";
    }

    await send_kill_request(student);
    student.is_alive = false;
    student.kill_text = "Grieve pet death";
    student.hat_button_text = "Pet is dead";
    student.isLoading = false;
}

function data_context() {
   
    const students = request_students();
    const selected = students.length > 0 ? students[0] : null;

    return {
        students: students,
        selected: selected, 
        isLoading: false
    };
}


window.Client = Client;
window.data_context = data_context;
window.change_hat = change_hat;
window.kill_pet = kill_pet;