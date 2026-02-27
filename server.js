const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint
app.post('/calculate', (req, res) => {
    try {
        const { subjects } = req.body;

        if (!subjects || !Array.isArray(subjects)) {
            return res.status(400).json({ error: "Invalid data format. Expected a 'subjects' array." });
        }

        const results = [];

        for (const subject of subjects) {
            const { name, total, attended } = subject;

            // Validate presence
            if (total === undefined || attended === undefined) {
                return res.status(400).json({ error: "Total and attended periods are required for all subjects." });
            }

            // Validate types and constraints
            if (typeof total !== 'number' || typeof attended !== 'number') {
                return res.status(400).json({ error: "Total and attended periods must be numbers." });
            }
            if (total <= 0) {
                return res.status(400).json({ error: `Total periods for ${name || 'a subject'} must be greater than 0.` });
            }
            if (attended < 0) {
                return res.status(400).json({ error: `Attended periods for ${name || 'a subject'} cannot be negative.` });
            }
            if (attended > total) {
                return res.status(400).json({ error: `Attended periods cannot exceed total periods for ${name || 'a subject'}.` });
            }

            // Calculation
            const percentage = (attended / total) * 100;
            results.push({
                name: name || "Unnamed Subject",
                percentage: Number(percentage.toFixed(1))
            });
        }

        // Response
        res.json({
            subjects: results
        });

    } catch (error) {
        console.error("Calculation Error:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
