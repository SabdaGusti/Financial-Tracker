import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Records from "./pages/Records";
import AddRecord from "./pages/AddRecord";
import RecordDetail from "./pages/RecordDetail";
import EditRecord from "./pages/EditRecord";
import Accounts from "./pages/Accounts";
import AddAccount from "./pages/AddAccount";
import AccountDetail from "./pages/AccountDetail";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/records" element={<Records />} />
        <Route path="/records/add" element={<AddRecord />} />
        <Route path="/records/:id" element={<RecordDetail />} />
        <Route path="/records/:id/edit" element={<EditRecord />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/add" element={<AddAccount />} />
        <Route path="/accounts/:id" element={<AccountDetail />} />
      </Route>
    </Routes>
  );
}
