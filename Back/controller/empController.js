const Employee = require ("../model/empModel.js")
const cloudinary = require ("../cloudinary.js")


const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
    res.status(200).json(employees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

 const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" })
    }
    res.status(200).json(employee)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createEmployee = async (req, res) => {
    try {
      const { name, email, mobileNo, position, dailyWage } = req.body;
  
      // Make sure the image file is uploaded correctly
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }
  
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
      // Check if Cloudinary upload was successful
      if (!result || !result.secure_url) {
        return res.status(400).json({ message: "Image upload failed" });
      }
  
      // Create new employee document
      const newEmployee = new Employee({
        name,
        email,
        mobileNo,
        position,
        dailyWage,
        image: result.secure_url, // Assuming your Employee schema expects 'image'
      });
  
      // Save employee to database
      const savedEmployee = await newEmployee.save();
      res.status(201).json(savedEmployee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
 const updateEmployee = async (req, res) => {
  try {
    const { name, email, mobileNo, position, dailyWage } = req.body
    const updateData = { name, email, mobileNo, position, dailyWage }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      updateData.imageUrl = result.secure_url
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" })
    }

    res.status(200).json(updatedEmployee)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const updateAttendance = async (req, res) => {
  try {
      const { employeeId, attendanceData } = req.body;

      if (!employeeId) {
          return res.status(400).json({ error: "Employee ID is required" });
      }

      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
          return res.status(400).json({ error: "Invalid Employee ID format" });
      }

      const updatedEmployee = await Employee.findByIdAndUpdate(
          employeeId,
          { $set: { attendance: attendanceData } },
          { new: true }
      );

      if (!updatedEmployee) {
          return res.status(404).json({ error: "Employee not found" });
      }

      res.status(200).json({ message: "Attendance updated", employee: updatedEmployee });
  } catch (error) {
      console.error("Error updating attendance:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id)
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" })
    }
    res.status(200).json({ message: "Employee deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, updateAttendance }