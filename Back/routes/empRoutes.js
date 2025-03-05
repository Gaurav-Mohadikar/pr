const express =require ("express")
const multer = require ("multer")
const { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, updateAttendance } = require("../controller/empController")


const router = express.Router()
const upload = multer({ dest: "uploads/" })

router.get("/allEmp", getAllEmployees)
router.get("/getById/:id", getEmployeeById)
router.post("/createEmp", upload.single("image"), createEmployee)
router.put("/update/:id", upload.single("image"), updateEmployee)
router.put('/attendance/:id', updateAttendance);
router.delete("/delete/:id", deleteEmployee)

module.exports = router

// http://localhost:3000/api/employee/allEmp 
// http://localhost:3000/api/employee/createEmp 
// http://localhost:3000/api/employee/update/id 
// http://localhost:3000/api/employee/delete/id 
// http://localhost:3000/api/employee/attendance/id 
