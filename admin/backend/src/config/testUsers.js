import bcrypt from "bcrypt";

// Pre-hashed password for "password123"
const hashedPassword =
    "$2b$10$Om2Vgp3x0FBZplSW.wHeGuvVP7F6lnf3PWdiSn3KwGrY2AQaorlKq";

export const testUsers = [
    {
        id: "test-admin-001",
        username: "testadmin",
        email: "test@admin.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        lastLogin: null,
    },
    {
        id: "test-super-admin-001",
        username: "superadmin",
        email: "super@admin.com",
        password: hashedPassword,
        role: "super_admin",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        lastLogin: null,
    },
];

export const testUserService = {
    findByUsername: (username) => {
        return testUsers.find((user) => user.username === username);
    },

    findByEmail: (email) => {
        return testUsers.find((user) => user.email === email);
    },

    findById: (id) => {
        return testUsers.find((user) => user.id === id);
    },

    validatePassword: async (plainPassword, hashedPassword) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    },

    userExists: (username, email) => {
        return testUsers.some(
            (user) => user.username === username || user.email === email
        );
    },
};
