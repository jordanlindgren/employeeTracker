const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
require("console.table");

const ACTIONS = {
  listDepartments: 1,
  listRoles: 2,
  listEmployees: 3,
  addDepartment: 4,
  addRoles: 5,
  addEmployees: 6,
};
let conn;

async function addConnection() {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "employeetracker",
  });
  displayActionMenu();
}

const questions = [
  {
    name: "action",
    message: "select action",
    type: "list",
    choices: [
      { name: "View All Departments", value: ACTIONS.listDepartments },
      { name: "View All Roles", value: ACTIONS.listRoles },
      { name: "View All Employees", value: ACTIONS.listEmployees },
      { name: "Add Department", value: ACTIONS.addDepartment },
      { name: "Add Roles", value: ACTIONS.addRoles },
      { name: "Add Employees", value: ACTIONS.addEmployees },
      { name: "Exit App", value: 1000 },
    ],
  },
];

function displayActionMenu() {
  inquirer.prompt(questions).then(async (ans) => {
    // connect to the employeetracer database

    if (ans.action === ACTIONS.listDepartments) {
      // execute a SQL SELECT statement on the departments table
      const sql = "SELECT id, name FROM departments";

      let [results] = await conn.query(sql);
      // let queryResults =  await db.query(sql);
      // let results = queryResults[0]

      // Display the query results to the console
      console.table(results);
    } else if (ans.action === ACTIONS.addDepartment) {
      const departmentNamePrompt = {
        name: "name",
        message: "Enter name of Department",
        type: "input",
      };

      let response = await inquirer.prompt(departmentNamePrompt);

      const sql = "INSERT INTO departments (name) VALUES (?)";

      const params = [response.name];

      await conn.query(sql, params);
      console.log(`Added ${response.name} to the Database`);
    } else if (ans.action === ACTIONS.listRoles) {
      // execute a SQL SELECT statement on the departments table
      const sql = "SELECT * FROM roles";

      let [results] = await conn.query(sql);
      // let queryResults =  await db.query(sql);
      // let results = queryResults[0]

      // Display the query results to the console
      console.table(results);
    } else if (ans.action === ACTIONS.addRoles) {
      const departmentNamePrompt = [
        {
          name: "job_title",
          message: "Enter Job",
          type: "input",
        },

        {
          name: "department_id",
          message: "Enter Department Id",
          type: "list",
          choices: [
            { name: "quality assurance", value: 1 },
            { name: "destruction", value: 2 },
            { name: "money", value: 3 },
          ],
        },
        {
          name: "salary",
          message: "Enter Salary",
          type: "input",
        },
      ];

      let response = await inquirer.prompt(departmentNamePrompt);

      const sql =
        "INSERT INTO roles (job_title, department_id, salary) VALUES (?,?,?)";

      const params = [response.name];

      // await
      conn.query(
        sql,
        [response.job_title, response.department_id, response.salary],
        function (err, data) {
          if (err) throw err;
          console.table(data);
        }
      );
    } else if (ans.action === ACTIONS.addEmployees) {
      const departmentNamePrompt = [
        {
          name: "first_name",
          message: "Enter First Name",
          type: "input",
        },
        {
          name: "last_name",
          message: "Enter Last Name",
          type: "input",
        },

        {
          name: "role_id",
          message: "Enter Role Id",
          type: "list",
          choices: [
            { name: "cleaner", value: 1 },
            { name: "worker", value: 2 },
            { name: "banker", value: 3 },
          ],
        },
        {
          name: "manager_id",
          message: "Enter manager Id",
          type: "list",
          choices: [
            { name: "", value: 1 },
            { name: "", value: 2 },
            { name: "", value: 3 },
          ],
        },
      ];

      let response = await inquirer.prompt(departmentNamePrompt);

      const sql =
        "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";

      const params = [response.name];

      await conn.query(sql, [
        response.first_name,
        response.last_name,
        response.role_id,
        response.manager_id,
      ]);
      console.log(`Added ${response} to the Database`);
    } else if (ans.action === ACTIONS.listEmployees) {
      // execute a SQL SELECT statement on the departments table
      const sql = "SELECT * FROM employees";

      let [results] = await conn.query(sql);
      // let queryResults =  await db.query(sql);
      // let results = queryResults[0]

      // Display the query results to the console
      console.table(results);
    } else {
      conn.end();
      process.exit(0);
    }

    displayActionMenu();
  });
}

addConnection();
