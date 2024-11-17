function request_students() {
    return [
        { "Name": "James", "Id": 1, "has_hat":false, "is_alive":true,  hat_button_text:"Add hat", kill_text:"Kill", isLoading:false},
        { "Name": "Reuben", "Id": 2, "has_hat":false, "is_alive":true, hat_button_text:"Add hat", kill_text:"Kill", isLoading:false}
    ];
}

function send_hat_change_request(student) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Hat request processed for " + student.Name);
            resolve(); 
        }, 2000);
    });
}


function send_kill_request(student){
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Hat request processed for " + student.Name);
            resolve(); 
        }, 2000);
    });
}


async function change_hat(student){

    console.log("changing hat status of student " + student.Name)

    // do nothing if students pet is dead
    if (student.is_alive == false){
        return;
    }

    student.isLoading = true

    if (!student.has_hat){
        student.hat_button_text = "Adding hat..."
        await send_hat_change_request(student);
        student.has_hat = true;
        student.hat_button_text = "Remove Hat";
    }
    else {
        student.hat_button_text = "removing hat..."
        await send_hat_change_request(student);
        student.has_hat = !student.has_hat;
        student.hat_button_text = "Give Hat";
    }
    student.isLoading = false
}

async function kill_pet(student){

    if (student.is_alive == false){
        return;
    }

    console.log("killing pet of " + student.Name)
    student.isLoading = true;
    
    if (!student.is_alive){
        student.kill_text = "Grieving..."
    }
    else{
        student.kill_text = "Killing pet..."
    }
    
    await send_kill_request(student)
    student.is_alive = false;
    student.kill_text = "Grieve pet death"
    student.isLoading = false;
}

function data_context() {
    const students = request_students()
    return {
        students: students, 
        selected: students[0],
        isLoading:false
    };
}

window.data_context = data_context;
window.change_hat = change_hat;
window.kill_pet = kill_pet;
