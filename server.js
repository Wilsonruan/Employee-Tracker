var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    password: "",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) {
        console.error("This isn't working!!!!" + connection.config)
        throw err;
    }
    console.log("connected as id " + connection.threadId);
    start_employee_tracker()

});

function start_employee_tracker() {

    inquirer.prompt([
        {
            type: "list",
            name: "what_to_do",
            message: "What would you like to do?",
            choices: [
                "Add Department", "Add Role", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Role", "Delete Department/Role/Employee","Exit"
                //, "Update Employee Manager", "View Employees by Manager", "View the Total Budget of a Department"
            ]
        },
        {
            type: "input",
            name: "department_name",
            message: "Input Department Name:",
            when: function (answers) {
                return answers.what_to_do == "Add Department"
            },
        }
    ])
        .then((response) => {
            if (response.what_to_do == "Add Department") {
                add_department(response.department_name);
            } else if (response.what_to_do == "View Departments") {
                view_departments();
            } else if (response.what_to_do == "Add Role") {
                add_role(response);
            } else if (response.what_to_do == "View Roles") {
                view_roles();
            } else if (response.what_to_do == "Add Employee") {
                add_employee(response);
            } else if (response.what_to_do == "View Employees") {
                view_employees();
            } else if (response.what_to_do == "Update Employee Role") {
                update_employee_roles(response);
            } else if (response.what_to_do == "Delete Department") {
                delete_department();
            } else if (response.what_to_do == "Exit") {
                console.log("Thank you for using Employee Tracker!")
                return connection.end()
            }
        }).catch((err) => {
            console.error(err)
            return connection.end()
        })
}

function delete_department () {
    inquirer.prompt([
        {
            type: "list",
            name: "delete",
            message: "Which selector would you like to delete: ",
            choices: ["department", "role", "employee"]
        }
    ]).then((response) => {
        const get_dept_query_str = `SELECT * FROM ${response.delete}`
        connection.query(get_dept_query_str, function (err, department_table) {
            let departments = [];
            let list = []

            department_table.forEach(dept => {
                if (response.delete === "department") {
                    departments.push(dept.dept_name)
                    list = 'dept_name'
                } else if (response.delete === "role") {
                    departments.push(dept.title)
                    list = 'title'
                } else if (response.delete == "employee") {
                    departments.push(dept.first_name)
                    list = 'first_name'
                }
            })
    
        if (departments.length === 0) {
            console.log(`You must add a ${response.delete} first.`)
            return start_employee_tracker();
        }

        inquirer.prompt([
            {
                type: "list",
                name: "departments_select",
                message: `Which ${response.delete} would you like to delete:`,
                choices: departments
            }
        ]).then((response2) => {
            let query_str = 
            `
            DELETE FROM ${response.delete} WHERE ${list}='${response2.departments_select}';
            `;
            connection.query(query_str, function (err, res) {
                if (err) throw err;
                start_employee_tracker()
            })
        })
    })
    })



}
    

function add_department(department) {
    const query_str =
        `
            INSERT INTO department (dept_name)
            VALUES ("${department}")
        `;
    connection.query(query_str, function (err, res) {
        if (err) throw err;
        start_employee_tracker()
    })

}

async function view_departments() {
    const query_str = "SELECT * from department"
    connection.query(query_str, function (err, res) {
        if (err) throw err;
        console.log("========= List of Departments =========");
        console.table(res);
        start_employee_tracker();
        return res;
    })
}

function add_role(role) {
    const get_dept_query_str = 'SELECT * FROM department'
    connection.query(get_dept_query_str, function (err, department_table) {
        let departments = [];

        department_table.forEach(dept => {
            departments.push(dept.dept_name)
        })

        if (departments.length === 0) {
            console.log("You must add a department first.")
            return start_employee_tracker();
        }

        inquirer.prompt([
            {
                type: "input",
                name: "role_title",
                message: "Input Role Title: ",
            },
            {
                type: "input",
                name: "role_salary",
                message: "Input Role Salary (all numbers no characters): ",
            },
            {
                type: "list",
                name: "role_department",
                message: "Input Role's Department: ",
                choices: departments
            }
        ]).then((response) => {
            let query_str;
            for (let i = 0; i <= department_table.length; i += 1) {
                if (response.role_department === department_table[i].dept_name) {
                    query_str =
                        `
                        INSERT INTO role (title, salary, dept_id)
                        VALUES ("${response.role_title}", "${response.role_salary}", "${department_table[i].dept_id}")
                    `;
                    break;
                }

            };

            connection.query(query_str, function (err, res) {
                if (err) throw err;
                start_employee_tracker()
            })
        })
    })

}

async function view_roles() {

    console.log("========= List of roles =========")
    const query_str =
        `
                SELECT title, salary, dept_name
                FROM role
                LEFT JOIN department
                ON role.dept_id = department.dept_id
            `
    connection.query(query_str, function (err, res) {
        if (err) throw err;
        console.table(res)
        start_employee_tracker()
    })

}

async function add_employee(restart_employee_tracker = true) {

    let role_list = []
    connection.query("SELECT role_id, title, dept_name, salary  FROM role LEFT JOIN department ON department.dept_id = role.dept_id", (err, role_table) => {
        if (role_table.length === 0){
            console.log("You must add a role first")
            return start_employee_tracker()
        }
        role_table.forEach(role => {
            role_list.push(role.title + " " + role.dept_name + " " + role.salary)
        });
        connection.query("SELECT emp_id, first_name, last_name from employee", (err, employee_table) => {
            let employee_list = []
            employee_table.forEach(emp => {
                employee_list.push(emp.first_name + " " + emp.last_name);
            })

            inquirer.prompt([
                {
                    type: "input",
                    name: "employee_first_name",
                    message: "Input Employee's First Name: ",
                },
                {
                    type: "input",
                    name: "employee_last_name",
                    message: "Input Employee's Last Name: ",
                },
                {
                    type: "list",
                    name: "employee_role",
                    message: "Input Employee's Role: ",
                    choices: role_list
                },
                {
                    type: "list",
                    name: "employee_manager",
                    message: "Input Employee's Manager: ",
                    choices: employee_list,
                    when: function(answers){
                        return employee_list >= 1
                    }
                }
            ]).then((role_questions_response) => {
                    let role_id;
                    for (let j = 0; j <= role_list.length; j += 1) {
                        if (role_questions_response.employee_role === role_table[j].title + " " + role_table[j].dept_name + " " + role_table[j].salary) {
                            role_id = role_table[j].role_id;
                            break;
                        }
                    }
                    let manager_id = 1;
                    for (let index = 0; index < employee_table.length; index++) {
                        if (role_questions_response.employee_manager === employee_table[index].first_name + " " + employee_table[index].last_name) {
                            manager_id = employee_table[index].emp_id;
                            break;
                        }

                    }

                    const query_str =
                        `
                            INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (
                                "${role_questions_response.employee_first_name}",
                                "${role_questions_response.employee_last_name}",
                                "${role_id}",
                                "${manager_id}"
                            )
                        `;

                    connection.query(query_str, function (err, res) {
                        if (err) throw err;
                        if(restart_employee_tracker){
                            return start_employee_tracker()
                        }
                        return
                    })

                })
        })
    })

}

async function view_employees() {
    console.log("========= List of employees =========")
    const query_str =
        `
            SELECT first_name as "First Name", last_name as "Last Name", title as Title, salary as Salary
            FROM employee
            LEFT JOIN role
            ON employee.role_id = role.role_id;
        `
    connection.query(query_str, function (err, res) {
        if (err) throw err;
        console.table(res)
        start_employee_tracker()
    })
}

async function update_employee_roles(update) {
    const get_employees_query =
        `
            SELECT emp_id, first_name, last_name
            FROM employee
        `;
    const get_roles_query =
        `
            SELECT role_id as Role, title as Title, dept_name as Department, salary as Salary
            FROM role
            LEFT JOIN department ON department.dept_id = role.dept_id
        `;
    const update_role_query =
        `
            UPDATE employee
            SET role_id= ?
            WHERE emp_id = ?
        `;

    let employee_table;
    let employee_list = [];
    let role_table;
    let role_list = [];

    connection.query(get_employees_query, function (err, emp_table) {
            if (err) throw err;

            if (emp_table.length === 0){
                console.log("You must add an employee first.")
                return start_employee_tracker();
            }
            employee_table = emp_table;
            emp_table.forEach(emp => {
                employee_list.push(emp.first_name + " " + emp.last_name);
            })
            connection.query(get_roles_query, function (err, roles_table) {
                    if (roles_table.length === 0){
                        console.log("You must add a role first");
                        return start_employee_tracker();
                    }
                    role_table = roles_table;
                    roles_table.forEach(role => {
                        role_list.push(role.Title + " " + role.Department + " " + role.Salary)
                    });
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "employee",
                            message: "Select Employee new: ",
                            choices: employee_list
                        },
                        {
                            type: "list",
                            name: "employee_role",
                            message: "Select New Role: ",
                            choices: role_list
                        },
                    ]).then((update_role_questions_response) => {
                            let role_id;
                            for (let j = 0; j <= role_list.length; j += 1) {
                                if (update_role_questions_response.employee_role === role_table[j].Title + " " + role_table[j].Department + " " + role_table[j].Salary) {
                                    role_id = role_table[j].Role;
                                    break;
                                }
                            }
                            let emp_id;
                            for (let index = 0; index < employee_table.length; index++) {
                                if (update_role_questions_response.employee === employee_table[index].first_name + " " + employee_table[index].last_name) {
                                    emp_id = employee_table[index].emp_id;
                                    break;
                                }
                            }
                            connection.query(update_role_query,[role_id, emp_id], function(err) {
                                if (err) throw err;
                                start_employee_tracker()
                            })
                        })
                        .catch((err)=>{
                            console.log(err);
                }) 
                }) 
        })
}