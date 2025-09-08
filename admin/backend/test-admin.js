import { testUserService } from "./src/config/testUsers.js";

async function testPasswordValidation() {
    try {
        console.log("Testing test admin functionality...\n");

        // Test finding users
        const testUser = testUserService.findByUsername("testadmin");
        console.log("✅ Found test user:", testUser.username);

        // Test password validation
        const isValid = await testUserService.validatePassword(
            "password123",
            testUser.password
        );
        console.log("✅ Correct password test:", isValid ? "PASSED" : "FAILED");

        const isInvalid = await testUserService.validatePassword(
            "wrongpassword",
            testUser.password
        );
        console.log(
            "✅ Wrong password test:",
            !isInvalid ? "PASSED" : "FAILED"
        );

        console.log("\nAvailable test users:");
        console.log(
            "- Username: testadmin, Password: password123, Role: admin"
        );
        console.log(
            "- Username: superadmin, Password: password123, Role: super_admin"
        );
    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
}

testPasswordValidation();
