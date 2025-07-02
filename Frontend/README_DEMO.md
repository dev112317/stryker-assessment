# Demo Mode Setup

When the production backend is not available, the application automatically switches to demo mode with mock data.

## Quick Demo Setup

### Option 1: Run Mock API Server (Recommended)
\`\`\`bash
# Start the mock API server
python scripts/mock_api_server.py
\`\`\`

The mock server will run on `http://localhost:5001` and provide:
- Mock document data
- Simulated batch processing
- System statistics
- Health checks

### Option 2: Frontend-Only Demo
If you don't want to run any backend, the frontend will automatically:
- Detect backend unavailability
- Switch to demo mode
- Show mock data
- Display a demo mode banner

## Demo Features

### Available in Demo Mode:
✅ **Document Upload Simulation** - Upload files and see simulated processing  
✅ **Batch Processing Demo** - Watch progress bars and status updates  
✅ **Document Management** - Browse mock documents with filters  
✅ **System Analytics** - View processing statistics and metrics  
✅ **Multi-Document Types** - See different document type examples  
✅ **Real-time Updates** - Simulated real-time progress tracking  

### Demo Data Includes:
- **5 Sample Documents** with various types and statuses
- **Processing Statistics** showing system performance
- **Batch Jobs** with realistic progress simulation
- **Document Type Distribution** across different categories

## Production vs Demo Mode

| Feature | Production Mode | Demo Mode |
|---------|----------------|-----------|
| Backend API | ✅ Required | ❌ Mock/Simulated |
| Database | ✅ PostgreSQL/SQLite | ❌ In-memory mock |
| File Processing | ✅ Real AI extraction | ❌ Simulated results |
| Batch Upload | ✅ Up to 50 files | ✅ Simulated processing |
| Real-time Updates | ✅ WebSocket/Polling | ✅ Simulated progress |
| Data Persistence | ✅ Permanent storage | ❌ Session-only |

## Switching Between Modes

The application automatically detects backend availability:

1. **Auto-Detection**: Tries to connect to `/api/v2/health`
2. **Graceful Fallback**: Switches to demo mode if backend unavailable
3. **Visual Indicator**: Shows demo mode banner when active
4. **Seamless Experience**: All UI features work in both modes

## Demo Mode Benefits

- **No Setup Required**: Works without any backend configuration
- **Full UI Testing**: Test all interface features and interactions
- **Realistic Data**: Mock data represents real-world scenarios
- **Performance Preview**: See how the system would perform at scale
- **Feature Demonstration**: Showcase all production capabilities

## Starting the Demo

1. **Frontend Only**:
   \`\`\`bash
   npm run dev
   # Visit http://localhost:3000
   # Demo mode activates automatically
   \`\`\`

2. **With Mock Backend**:
   \`\`\`bash
   # Terminal 1: Start mock API
   python scripts/mock_api_server.py
   
   # Terminal 2: Start frontend
   npm run dev
   \`\`\`

3. **Production Mode**:
   \`\`\`bash
   # Start full production stack
   docker-compose up -d
   \`\`\`

The application will automatically detect which backend is available and adjust accordingly!
