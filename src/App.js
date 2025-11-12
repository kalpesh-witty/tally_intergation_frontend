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
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/ledgers">Ledger List</Link> |{" "}
        <Link to="/units">Units List</Link> |{" "}
        <Link to="/stock-items">StockItems List</Link> |{" "}
        <Link to="/groups">Groups List</Link> |{" "}
        {/* <Link to="/currency">Currency List</Link> |{" "} */}
        <Link to="/voucher-types">Voucher Type</Link> |{" "}
        <Link to="/stock-categories">Stock Categories</Link> |{" "}
        <Link to="/budgets">Budgets</Link> |{" "}
        <Link to="/stock-groups">Stock Groups</Link> |{" "}
        <Link to="/godowns">Godown</Link> |{" "}
        <Link to="/employee-categories">Employee Categories</Link> |{" "}
        <Link to="/employees">Employee List</Link> |{" "}
        <Link to="/employee-groups">Employee Groups</Link>
        {/* <Link to="/scenarios">Scenarios</Link> */}
      </nav>

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
    </BrowserRouter>
  );
}

export default App;
