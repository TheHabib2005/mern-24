import express from "express";
import cookieParser from "cookie-parser";
import cookie from "cookie";

import cors from "cors";

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to handle CORS
app.use(cors({
    origin: 'http://localhost:3000', // Restrict to your frontend's origin
    credentials: true // Allow credentials (cookies) to be sent
}));



app.listen(8000, () => {

  console.log('Server running on http://localhost:3000');
});



app.get('/set-cookie', (req, res) => {
  const serializedCookie = cookie.serialize('token', 'your-jwt-token', {
    httpOnly: false,
    secure: true, // Make sure your site is served over HTTPS
    sameSite: 'None',
    maxAge: 3600, // 1 hour
    path: '/',    // Ensure cookie is accessible across the site
  });

  res.setHeader('Set-Cookie', serializedCookie);
  res.end('Cookie set');
});


