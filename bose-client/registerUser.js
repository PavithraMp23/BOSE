// registerUsers.js
const enrollUser = require('./enrollUser');

async function main() {
    try {
        await enrollUser("college_xyz", "institution");  // Example institution
        await enrollUser("student_001", "student");      // Example student
        await enrollUser("company_abc", "company");      // Example company
        console.log(" All users registered successfully!");
    } catch (error) {
        console.error(" Error registering users:", error);
    }
}

main();
