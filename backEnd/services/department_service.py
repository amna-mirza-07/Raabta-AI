def get_department(issue):

    departments = {
        "Pothole": "Road Maintenance Department",
        "Broken Traffic Light": "Traffic Engineering Department",
        "Garbage": "Solid Waste Management Department",
        "Water Leakage": "Water and Sanitation Department",
        "Street Light": "Electricity Department"
    }

    return departments.get(issue, "Municipal Corporation")