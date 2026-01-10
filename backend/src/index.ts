import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './auth/passport';
const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions + Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', sameSite: 'lax' },
  })
);

// Allow requests from the frontend with credentials (cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// API endpoints
import userRouter from './user/routes';
app.use('/user', userRouter);

import authRouter from './auth/routes';
app.use('/auth', authRouter);

import postRouter from './post/routes';
app.use('/post', postRouter);

// Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
