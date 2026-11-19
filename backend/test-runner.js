const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

const app = require('./server');

let server;
let baseUrl;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl + path);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(url, reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          parsed = body;
        }
        resolve({ status: res.statusCode, data: parsed, headers: res.headers });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   TASK MANAGEMENT API - AUTOMATED TEST SUITE        ');
  console.log('======================================================\n');

  const testPort = 5055;
  await new Promise((resolve) => {
    server = app.listen(testPort, () => {
      baseUrl = `http://127.0.0.1:${testPort}`;
      resolve();
    });
  });

  // Wait 1 second for mongoose to connect
  await new Promise((r) => setTimeout(r, 1000));

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(` ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.status === 'success', 'Health Check API is operational');

    // 2. User 1 Registration
    const rand = Math.floor(Math.random() * 100000);
    const user1Data = {
      name: 'Alice Johnson',
      email: `alice_${rand}@example.com`,
      password: 'SecurePassword123!',
    };

    const reg1 = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: user1Data,
    });
    assert(reg1.status === 201 && reg1.data.token && reg1.data.user.email === user1Data.email, 'User 1 Registration returns 201 and JWT');
    const token1 = reg1.data.token;

    // 3. User 2 Registration
    const user2Data = {
      name: 'Bob Smith',
      email: `bob_${rand}@example.com`,
      password: 'SecurePassword456!',
    };

    const reg2 = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: user2Data,
    });
    assert(reg2.status === 201 && reg2.data.token, 'User 2 Registration returns 201 and JWT');
    const token2 = reg2.data.token;

    // 4. User 1 Login
    const login1 = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: user1Data.email, password: user1Data.password },
    });
    assert(login1.status === 200 && login1.data.token, 'User 1 Login successful with matching credentials');

    // 5. Get Current User (/api/auth/me)
    const me = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(me.status === 200 && me.data.user.name === 'Alice Johnson', 'GET /api/auth/me returns authenticated user without password');

    // 6. User 1 creates Task A (High Priority, Overdue)
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 3);

    const taskA = await request('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: {
        title: 'Review System Architecture Document',
        description: 'Verify scalability and cloud microservice layout',
        dueDate: overdueDate.toISOString(),
        priority: 'High',
        status: 'To Do',
      },
    });
    assert(taskA.status === 201 && taskA.data.task.title.includes('System Architecture'), 'User 1 creates High Priority Task');
    const taskAId = taskA.data.task._id;

    // 7. User 1 creates Task B (Medium Priority, Due next week)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    const taskB = await request('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: {
        title: 'Implement React Frontend Components',
        description: 'Build dashboard widgets and filters',
        dueDate: futureDate.toISOString(),
        priority: 'Medium',
        status: 'In Progress',
      },
    });
    assert(taskB.status === 201 && taskB.data.task.priority === 'Medium', 'User 1 creates Medium Priority Task');
    const taskBId = taskB.data.task._id;

    // 8. User 2 creates Task C (Belongs to Bob)
    const taskC = await request('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token2}`,
      },
      body: {
        title: 'Bob Secret Task',
        description: 'Private data for Bob only',
        dueDate: futureDate.toISOString(),
        priority: 'Low',
        status: 'To Do',
      },
    });
    assert(taskC.status === 201, 'User 2 creates their own task');
    const taskCId = taskC.data.task._id;

    // 9. SECURITY VERIFICATION: Multi-Tenant Data Isolation
    // User 1 tries to access User 2's task
    const crossAccessGet = await request(`/api/tasks/${taskCId}`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(crossAccessGet.status === 404, 'SECURITY CHECK: User 1 CANNOT view User 2 task (Returned 404)');

    // User 1 tries to update User 2's task
    const crossAccessPut = await request(`/api/tasks/${taskCId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: { title: 'Hacked Title' },
    });
    assert(crossAccessPut.status === 404, 'SECURITY CHECK: User 1 CANNOT update User 2 task (Returned 404)');

    // User 1 tries to delete User 2's task
    const crossAccessDel = await request(`/api/tasks/${taskCId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(crossAccessDel.status === 404, 'SECURITY CHECK: User 1 CANNOT delete User 2 task (Returned 404)');

    // 10. Filter and Search Tasks
    const searchRes = await request('/api/tasks?search=System Architecture', {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(searchRes.status === 200 && searchRes.data.tasks.length === 1, 'Search tasks by title keyword');

    const priorityFilter = await request('/api/tasks?priority=High', {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(priorityFilter.status === 200 && priorityFilter.data.tasks.length === 1, 'Filter tasks by High priority');

    // 11. Quick Status Update (PATCH /api/tasks/:id/status)
    const patchStatus = await request(`/api/tasks/${taskAId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: { status: 'Done' },
    });
    assert(patchStatus.status === 200 && patchStatus.data.task.status === 'Done', 'Quick status update PATCH returns updated task with status Done');

    // 12. Dashboard Statistics
    const dashboard = await request('/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(
      dashboard.status === 200 &&
      dashboard.data.stats.totalTasks === 2 &&
      dashboard.data.stats.completedTasks === 1 &&
      dashboard.data.stats.inProgressTasks === 1,
      'Dashboard stats correctly calculate total, completed, and in-progress metrics'
    );

    // 13. Delete Task
    const delRes = await request(`/api/tasks/${taskAId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(delRes.status === 200 && delRes.data.deletedTaskId === taskAId, 'Task deleted successfully');

    // Verify task is now deleted
    const verifyDel = await request(`/api/tasks/${taskAId}`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(verifyDel.status === 404, 'Deleted task is no longer found');

  } catch (err) {
    console.error('Test Execution Error:', err);
    failed++;
  } finally {
    console.log('\n------------------------------------------------------');
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('------------------------------------------------------\n');

    if (server) server.close();
    await mongoose.disconnect();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();

