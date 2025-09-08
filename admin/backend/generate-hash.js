import bcrypt from "bcrypt";

async function generateHash() {
    try {
        const hash = await bcrypt.hash("password123", 10);
        console.log("Generated hash for password123:");
        console.log(hash);
    } catch (error) {
        console.error("Error generating hash:", error);
    }
}

generateHash();
