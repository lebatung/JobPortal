import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import Login from "./pages/users/Login";
import Register from "./pages/users/Registration";


// PROTECTED ROUTE
import ProtectedRoute from "./protected/ProtectedRoute";

//NAVIGATION BAR
import MyJobsCpn from "./components/NavbarComponents/MyJobs/MyJobsCpn";
import Companies from "./components/NavbarComponents/companies/Companies";

// ADMIN DASHBOARD
import AdminDashBoard from "./pages/admin/AdminDashboard";

import UserManagement from "./pages/admin/components/userComponents/UserManagement";
import ViewUserDetail from "./pages/admin/components/userComponents/ViewUserDetail";
import EditUserDetail from "./pages/admin/components/userComponents/EditUserDetail";
import AddUser from "./pages/admin/components/userComponents/AddUser"

import CategoriesManagement from "./pages/admin/components/categoriesComponents/CategoriesManagement";
import ViewCategory from "./pages/admin/components/categoriesComponents/ViewCategory";
import EditCategory from "./pages/admin/components/categoriesComponents/EditCategory";
import AddCategory from "./pages/admin/components/categoriesComponents/AddCategory";

import AdminBlogsManagement from "./pages/admin/components/blogComponents/BlogManagement";

// RECRUITMENT DASHBOARD
import RecruitmentDashboard from "./pages/users/RecruitmentDashboard";
import UserDetailManagement from "./pages/users/components/recruitmentComponents/userDetailManagement/UserDetailManagement";
import CandidatesManagement from "./pages/users/components/recruitmentComponents/candidateManagement/CandidatesManagement";
import BlogsManagement from "./pages/users/components/recruitmentComponents/blogManagement/BlogsManagement";

// CANDIDATE DASHBOARD
import CandidateDashboard from "./pages/users/CandidateDashboard";
import CandidateDetailManagement from "./pages/users/components/candidateComponents/userDetailManagement/UserDetailManagement";
import BlogsApplied from "./pages/users/components/candidateComponents/blogsAppliedManagement/BlogsAppliedManagement";
import Cvs from "./pages/users/components/candidateComponents/cvsManagement/CvsManagement";
import Favorites from "./pages/users/components/candidateComponents/favoritesManagement/FavoritesManagement";

//FORBIDDEN PAGE
import ForbiddenPage from "./errorpages/ForbiddenPage";

//AUTH CONTEXT PROVIDER
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />}>
              <Route path="/myJobs" element={<MyJobsCpn />} />
              <Route path="/companies" element={<Companies />} />
            </Route>

            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />

            <Route
              path="/adminDashboard"
              element={
                <ProtectedRoute
                  element={<AdminDashBoard />}
                  roles={['ROLE_ADMIN']} 
                />
              }
            >
              <Route path="/adminDashboard/users" element={<UserManagement />}>
                <Route path="/adminDashboard/users/viewUserDetail/:id" element={<ViewUserDetail />}/>
                <Route path="/adminDashboard/users/edit-user-detail/:id" element={<EditUserDetail />}/>
                <Route path="/adminDashboard/users/add-user" element={<AddUser />}/>
              </Route>
              
              <Route path="/adminDashboard/categories" element={<CategoriesManagement />}>
                <Route path="/adminDashboard/categories/viewCategory/:id" element={<ViewCategory />}/>
                <Route path="/adminDashboard/categories/edit-category/:id" element={<EditCategory />}/>
                <Route path="/adminDashboard/categories/add-category" element={<AddCategory />}/>
              </Route>
              <Route path="/adminDashboard/blogs" element={<AdminBlogsManagement />}>
                
              </Route>
              
            </Route>

            <Route 
            path="/recruitmentDashboard"
              element={
                <ProtectedRoute
                  element={<RecruitmentDashboard />}
                  roles={['ROLE_RECRUITMENT']} 
                />
              }
            >
              <Route path="/recruitmentDashboard/personalDetail" element={<UserDetailManagement />}></Route>
              <Route path="/recruitmentDashboard/blogs" element={<BlogsManagement />}></Route>
              <Route path="/recruitmentDashboard/candidates" element={<CandidatesManagement />}></Route>

            </Route>

            <Route 
            path="/candidateDashboard" 
              element={
                <ProtectedRoute
                  element={<CandidateDashboard />}
                  roles={['ROLE_CANDIDATE']} 
                />
              }
            >
              <Route path="/candidateDashboard/personalDetail" element={<CandidateDetailManagement/>}></Route>
              <Route path="/candidateDashboard/cvs" element={<Cvs/>}></Route>
              <Route path="/candidateDashboard/applied" element={<BlogsApplied/>}></Route>
              <Route path="/candidateDashboard/favorites" element={<Favorites/>}></Route>
            </Route>

            <Route path="/forbiddenPage" element={<ForbiddenPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
