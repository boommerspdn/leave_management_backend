const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')


const prisma = new PrismaClient()

const app = express()

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Home Page Route
app.get('/', (req, res) =>
  res.send('Leave Management API')
);


// Api Routes
app.use('/api/AdminDashboard', require('./routes/api/AdminDashboard'));
app.use('/api/ClockInOut', require('./routes/api/ClockInOut'));
app.use('/api/DayOff', require('./routes/api/DayOff'));
app.use('/api/department', require('./routes/api/department'));
app.use('/api/DepartmentDashboard', require('./routes/api/DepartmentDashboard'));
app.use('/api/employee', require('./routes/api/employee'));
app.use('/api/LeaveDocument', require('./routes/api/LeaveDocument'));
app.use('/api/LeaveStatistic', require('./routes/api/LeaveStatistic'));
app.use('/api/LeaveType', require('./routes/api/LeaveType'));


// Global function for error handling
global.checkingValidationError = (e, req, res) => {
  if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e)
      res.status(422).json({ status: 422, message: 'Incorrect field type provided or missing an input' })
  } else if (e.meta) {
      console.log(e)
      res.status(404).json({ status: 404, message: e.meta.cause })
  }
  else {
      console.log(e)
      res.status(400).json({ status: 400, message: "Error Occured" })
  }
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));