import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuth() {
  console.log('Auth attempt - Email:', process.env.GOOGLE_CLIENT_EMAIL?.substring(0, 20) + '...');
  console.log('Auth attempt - Key exists:', !!process.env.GOOGLE_PRIVATE_KEY);
  console.log('Auth attempt - Sheet ID:', process.env.GOOGLE_SHEET_ID);
  
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
    throw new Error('Missing environment variables');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });
  return auth;
}

export default async function handler(req, res) {
  const { method } = req;
  
  try {
    console.log('Request method:', method);
    
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (method === 'GET') {
      // Test connection
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:J1',
      });
      
      console.log('Sheet connection successful');

      // Read all data
      const dataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A2:J',
      });

      const rows = dataResponse.data.values || [];
      const data = rows.map(row => ({
        username: row[0] || '',
        week: parseInt(row[1]) || 0,
        day: parseInt(row[2]) || 0,
        exercise: row[3] || '',
        sets: parseInt(row[4]) || 0,
        reps: row[5] || '',
        rest: row[6] || '',
        note: row[7] || '',
        completed: row[8] === 'true',
        timestamp: row[9] || '',
      }));

      res.status(200).json({ success: true, data });
      
    } else if (method === 'POST') {
      const { username, week, day, exercise, sets, reps, rest, note, completed } = req.body;
      
      console.log('POST data:', { username, week, day, exercise, sets, reps, rest, note, completed });
      
      const timestamp = new Date().toISOString();
      
      // Check if row exists
      const readResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A2:J',
      });

      const rows = readResponse.data.values || [];
      let rowIndex = -1;
      
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === username && 
            parseInt(rows[i][1]) === week && 
            parseInt(rows[i][2]) === day && 
            rows[i][3] === exercise) {
          rowIndex = i + 2;
          break;
        }
      }

      if (rowIndex > 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Sheet1!A${rowIndex}:J${rowIndex}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[
              username, week, day, exercise, sets, reps, rest, note, completed.toString(), timestamp
            ]],
          },
        });
        console.log('Updated row', rowIndex);
      } else {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'Sheet1!A:J',
          valueInputOption: 'RAW',
          requestBody: {
            values: [[
              username, week, day, exercise, sets, reps, rest, note, completed.toString(), timestamp
            ]],
          },
        });
        console.log('Appended new row');
      }

      res.status(200).json({ success: true, message: 'Data saved' });
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}
