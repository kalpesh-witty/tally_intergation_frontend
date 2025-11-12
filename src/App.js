import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import LedgerList from './pages/LedgerList';
import UnitList from './pages/UnitList';
import StockItemList from './pages/StockItemList';
import GroupList from './pages/GroupList';
import CurrencyList from './pages/CurrencyList';
import VoucherTypeList from './pages/VoucherTypeList';
import StockCategoryList from './pages/StockCategoryList';
import BudgetList from './pages/BudgetList';
import StockGroupList from './pages/StockGroupList';
import GodownList from './pages/GodownList';
import EmployeeCategoriesList from './pages/EmployeeCategoriesList';
import EmployeeGroupList from './pages/EmployeeGroupList';
import EmployeeList from './pages/EmployeeList';
// import ScenarioList from './pages/ScenarioList';

function App() {
  return (
    <BrowserRouter>
      {/* 🔹 Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            🧾 Tally Dashboard
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>

              {/* Masters Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="mastersDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Masters
                </a>
                <ul className="dropdown-menu" aria-labelledby="mastersDropdown">
                  <li><Link className="dropdown-item" to="/groups">Groups</Link></li>
                  <li><Link className="dropdown-item" to="/ledgers">Ledgers</Link></li>
                  <li><Link className="dropdown-item" to="/units">Units</Link></li>
                  <li><Link className="dropdown-item" to="/voucher-types">Voucher Types</Link></li>
                  <li><Link className="dropdown-item" to="/budgets">Budgets</Link></li>
                  {/* <li><Link className="dropdown-item" to="/currency">Currency</Link></li> */}
                </ul>
              </li>

              {/* Inventory Dropdown */}
              <li className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  id="inventoryDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Inventory
                </a>
                <ul className="dropdown-menu" aria-labelledby="inventoryDropdown">
                  <li><Link className="dropdown-item" to="/stock-items">Stock Items</Link></li>
                  <li><Link className="dropdown-item" to="/stock-groups">Stock Groups</Link></li>
                  <li><Link className="dropdown-item" to="/stock-categories">Stock Categories</Link></li>
                  <li><Link className="dropdown-item" to="/godowns">Godowns</Link></li>
                </ul>
              </li>

              {/* Employees Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="employeeDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Employees
                </a>
                <ul className="dropdown-menu" aria-labelledby="employeeDropdown">
                  <li><Link className="dropdown-item" to="/employee-categories">Employee Categories</Link></li>
                  <li><Link className="dropdown-item" to="/employee-groups">Employee Groups</Link></li>
                  <li><Link className="dropdown-item" to="/employees">Employee List</Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 🔹 Page Routes */}
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ledgers" element={<LedgerList />} />
          <Route path="/stock-items" element={<StockItemList />} />
          <Route path="/groups" element={<GroupList />} />
          <Route path="/currency" element={<CurrencyList />} />
          <Route path="/units" element={<UnitList />} />
          <Route path="/voucher-types" element={<VoucherTypeList />} />
          <Route path="/stock-categories" element={<StockCategoryList />} />
          <Route path="/budgets" element={<BudgetList />} />
          <Route path="/stock-groups" element={<StockGroupList />} />
          <Route path="/godowns" element={<GodownList />} />
          <Route path="/employee-categories" element={<EmployeeCategoriesList />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employee-groups" element={<EmployeeGroupList />} />
          {/* <Route path="/scenarios" element={<ScenarioList />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;