class Report:

    def __init__(self, issue, department, complaint, image_path):
        self.issue = issue
        self.department = department
        self.complaint = complaint
        self.image_path = image_path

    def to_dict(self):
        return {
            "issue": self.issue,
            "department": self.department,
            "complaint": self.complaint,
            "image_path": self.image_path
        }