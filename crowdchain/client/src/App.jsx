import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import EventList from "./pages/EventList";
import EventDetails from "./pages/EventDetails";
import AdminDashboard from "./pages/AdminDashboard";
import MyTickets from "./pages/MyTickets";

function App() {
  return (
    <Router>
      <div className="min-h-screen selection:bg-blue-500/30">
        <Navbar />
        <main className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-tickets" element={<MyTickets />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
