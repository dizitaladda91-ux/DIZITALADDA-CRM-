import "./EmployeeFooter.css";

const EmployeeFooter = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="employee-footer">

      <div className="footer-left">
        <p>
          © {currentYear} DIZITALADDA. All Rights Reserved.
        </p>
      </div>

      <div className="footer-center">
        <span>Employee Portal</span>
      </div>

      <div className="footer-right">
        <span>Version 1.0.0</span>
      </div>

    </footer>
  );
};

export default EmployeeFooter;
