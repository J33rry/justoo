import app from "./app.js";

const PORT = process.env.PORT || 5163;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
