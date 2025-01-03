const express = require('express');
const authRoutes = require('./auth.route')
const candidateRoutes = require('./candidate.route')
const interviewRoutes = require('./interview.route')
const userRoutes = require('./user.route')

const router = express.Router();

const defaultRoutes = [
    {
      path: '/api/auth',
      route: authRoutes,
    },
    {
      path: '/api/candidate',
      route: candidateRoutes,
    },
    {
        path: '/api/interview',
        route: interviewRoutes,
    },
    {
        path: '/api/user',
        route: userRoutes,
    },
  ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;