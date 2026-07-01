const BASE_URL = "http://localhost:5000/api";

const logTestResult = (name, passed, detail = "") => {
  console.log(`[${passed ? "PASS" : "FAIL"}] ${name} ${detail ? `(${detail})` : ""}`);
};

async function runTests() {
  console.log("Starting backend verification tests...\n");

  try {
    // Test 1: Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "jennifer.davis@admin.edu", password: "password", role: "admin" })
    });
    
    if (!adminLoginRes.ok) {
      throw new Error(`Admin login failed: ${adminLoginRes.statusText}`);
    }
    const adminData = await adminLoginRes.json();
    const adminToken = adminData.token;
    logTestResult("Admin Login", true);

    // Test 2: Student Login (Alex)
    const alexLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "alex.johnson@student.edu", password: "password", role: "student" })
    });
    
    if (!alexLoginRes.ok) {
      throw new Error(`Student login failed: ${alexLoginRes.statusText}`);
    }
    const alexData = await alexLoginRes.json();
    const alexToken = alexData.token;
    const alexId = alexData.id || alexData.user?.id || alexData.user?._id; 
    // Let's print out what alexData has to verify
    const alexRealId = alexData.id || (alexData.user && alexData.user.id);
    logTestResult("Student Login", true, `Alex ID: ${alexRealId}`);

    // Test 3: Student Login (Sarah)
    const sarahLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "sarah.williams@student.edu", password: "password", role: "student" })
    });
    const sarahData = await sarahLoginRes.json();
    const sarahRealId = sarahData.id || (sarahData.user && sarahData.user.id);

    // Test 4: Student Attendance Isolation
    const attendanceRes = await fetch(`${BASE_URL}/academic/attendance`, {
      headers: { "Authorization": `Bearer ${alexToken}` }
    });
    const attendance = await attendanceRes.json();
    const otherStudentAttendance = attendance.filter(a => a.studentId !== alexRealId);
    const hasIsolationAttendance = otherStudentAttendance.length === 0;
    logTestResult("Student Attendance Isolation", hasIsolationAttendance, `Total logs found: ${attendance.length}`);

    // Test 5: Student Grades Isolation
    const gradesRes = await fetch(`${BASE_URL}/academic/grades`, {
      headers: { "Authorization": `Bearer ${alexToken}` }
    });
    const grades = await gradesRes.json();
    const otherStudentGrades = grades.filter(g => g.studentId !== alexRealId);
    const hasIsolationGrades = otherStudentGrades.length === 0;
    logTestResult("Student Grades Isolation", hasIsolationGrades, `Total logs found: ${grades.length}`);

    // Test 6: Student Submissions Isolation
    const submissionsRes = await fetch(`${BASE_URL}/academic/submissions`, {
      headers: { "Authorization": `Bearer ${alexToken}` }
    });
    const submissionsList = await submissionsRes.json();
    const otherStudentSubmissions = submissionsList.filter(s => s.studentId !== alexRealId);
    const hasIsolationSubmissions = otherStudentSubmissions.length === 0;
    logTestResult("Student Submissions Isolation", hasIsolationSubmissions, `Total logs found: ${submissionsList.length}`);

    // Test 7: Student cannot submit assignment for someone else
    const mockAssignmentId = "60c72b2f9b1d8b23c88b4567"; // Valid Hex string but dummy ID
    const badSubmitRes = await fetch(`${BASE_URL}/academic/submissions`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${alexToken}`
      },
      body: JSON.stringify({
        assignmentId: mockAssignmentId,
        studentId: sarahRealId,
        fileName: "malicious_submit.zip"
      })
    });
    logTestResult("Submit Assignment for another student blocked (403)", badSubmitRes.status === 403, `Status: ${badSubmitRes.status}`);

    // Test 8: Student can submit assignment for themselves
    const goodSubmitRes = await fetch(`${BASE_URL}/academic/submissions`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${alexToken}`
      },
      body: JSON.stringify({
        assignmentId: mockAssignmentId,
        studentId: alexRealId,
        fileName: "my_submit.zip"
      })
    });
    logTestResult("Submit Assignment for self allowed (201)", goodSubmitRes.status === 201, `Status: ${goodSubmitRes.status}`);

    // Test 9: Optional User Pagination (page, limit)
    const userListResAll = await fetch(`${BASE_URL}/users`, {
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    const allUsers = await userListResAll.json();
    
    const userListResPaginated = await fetch(`${BASE_URL}/users?page=1&limit=2`, {
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    const paginatedUsers = await userListResPaginated.json();
    
    const isArrayFormat = Array.isArray(paginatedUsers);
    const correctLimit = paginatedUsers.length <= 2;
    logTestResult("User List Pagination (Format is Array)", isArrayFormat, `Type: ${typeof paginatedUsers}`);
    logTestResult("User List Pagination (Limit respected)", correctLimit, `Returned length: ${paginatedUsers.length} vs Total: ${allUsers.length}`);

    // Test 10: ObjectId format validation returns 400 Bad Request
    const invalidIdRes = await fetch(`${BASE_URL}/users/invalid-mongodb-id`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({ name: "Attempt Update" })
    });
    const invalidIdBody = await invalidIdRes.json();
    console.log("Invalid ObjectId Response:", JSON.stringify(invalidIdBody, null, 2));
    logTestResult("Invalid ObjectId returns 400 Bad Request", invalidIdRes.status === 400, `Status: ${invalidIdRes.status}`);

    // Test 11: Valid ObjectId not found returns 404
    const validHexIdNotFoundRes = await fetch(`${BASE_URL}/users/507f1f77bcf86cd799439011`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({ name: "Attempt Update" })
    });
    logTestResult("Valid hex but non-existent ObjectId returns 404", validHexIdNotFoundRes.status === 404, `Status: ${validHexIdNotFoundRes.status}`);

  } catch (error) {
    console.error("Test execution failed:", error);
  }
}

runTests();
