import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { configDotenv } from "dotenv";

// Import routes
import profileRoutes from "./src/routes/profile.js";
import onboardingRoutes from "./src/routes/onboarding.js";
import transformationRoutes from "./src/routes/transformation.js";
import simplificationRoutes from './src/routes/simplification.js';

// Import middleware
import { mockAuth } from "./src/middleware/auth.js";

// Load environment variables
configDotenv();

const app = express();
const PORT = process.env.PORT || 3071;

// Security and performance middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Mock authentication for MVP demo
app.use(mockAuth);

// API Routes
app.use("/api/profile", profileRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/transform", transformationRoutes);
app.use('/api/simplify', simplificationRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "CogniWeave Backend",
    version: "1.0.0",
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'CogniWeave Backend API',
    version: '1.1.0',
    description: 'An Edge-Native AI Fabric for Cognitive Accessibility',
    newFeatures: {
      claudeSimplification: 'Powered by Claude 3.5 Sonnet for advanced text simplification'
    },
    endpoints: {
      health: 'GET /health',
      profile: {
        create: 'POST /api/profile',
        get: 'GET /api/profile/:userId',
        update: 'PUT /api/profile/:userId'
      },
      onboarding: {
        generate: 'POST /api/onboarding/generate'
      },
      transformation: {
        text: 'POST /api/transform/text',
        visuals: 'POST /api/transform/visuals',
        page: 'POST /api/transform/page'
      },
      simplification: {
        text: 'POST /api/simplify/text',
        essay: 'POST /api/simplify/essay',
        batch: 'POST /api/simplify/batch',
        compare: 'POST /api/simplify/compare',
        samples: 'GET /api/simplify/demo/samples'
      }
    },
    sampleUsers: ['alex-chen-2025', 'demo-user-2025', 'test-student-2025'],
    models: {
      profileGeneration: 'Claude 3 Opus (Amazon Bedrock)',
      textSimplification: 'Claude 3.5 Sonnet v2 (Amazon Bedrock)'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
      suggestion: 'Check the API documentation at the root endpoint'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CogniWeave Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/`);
  console.log(`🧠 Built with AWS Bedrock (Claude 3 Opus + Claude 3.5 Sonnet v2)`);
  console.log(`🔤 New: Advanced text simplification with Claude 3.5 Sonnet`);
});

export default app;
