import { useState, lazy, useEffect, Suspense, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
const Setting = lazy(() => import("./pages/Setting"));
const Landing = lazy(() => import("./pages/Landing"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Blog = lazy(() => import("./pages/Blog"));
const Converter = lazy(() => import("./pages/Converter"));
const Txhistory = lazy(() => import("./pages/Txhistory"));
const Verification = lazy(() => import("./pages/Verification"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
import toast, { useToasterStore } from "react-hot-toast";
import MainLoader from "./components/loaders/MainLoader";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "./theme/theme";
import NavBar from "./components/Navbar";
import Xender from "./pages/Xender";
const Receiver = lazy(() => import("./pages/Receiver"))


function App() {
  const { pathname } = useLocation();
  const { toasts } = useToasterStore();
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  useEffect(() => {
    if (!navigator.onLine) {
      toast("You are currently offline!", {
        style: {
          backgroundColor: "gray",
          color: "#fff",
        },
        icon: (
          <>
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              height="1em"
              width="1em"
            >
              <path d="M7.25 2c-.69 0-1.351.13-1.957.371a.75.75 0 10.554 1.394c.43-.17.903-.265 1.403-.265a3.72 3.72 0 013.541 2.496.75.75 0 00.709.504c1.676 0 3 1.324 3 3a3 3 0 01-.681 1.92.75.75 0 001.156.955A4.496 4.496 0 0016 9.5a4.472 4.472 0 00-3.983-4.471A5.222 5.222 0 007.25 2z" />
              <path
                fillRule="evenodd"
                d="M.72 1.72a.75.75 0 011.06 0l2.311 2.31c.03.025.056.052.08.08l8.531 8.532a.785.785 0 01.035.034l2.043 2.044a.75.75 0 11-1.06 1.06l-1.8-1.799a4.64 4.64 0 01-.42.019h-8A3.475 3.475 0 010 10.5c0-1.41.809-2.614 2.001-3.17a5.218 5.218 0 01.646-2.622L.72 2.78a.75.75 0 010-1.06zM3.5 7.25c0-.505.096-.983.271-1.418L10.44 12.5H3.5c-1.124 0-2-.876-2-2 0-.95.624-1.716 1.484-1.936a.75.75 0 00.557-.833A4.1 4.1 0 013.5 7.25z"
              />
            </svg>
          </>
        ),
      });
    }
  }, [pathname]);

  const TOAST_LIMIT = 1;
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Suspense fallback={<MainLoader />}>
          <NavBar />
          <Routes>
            <Route path="/l" element={<Landing />}></Route>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/portfolio" element={<Portfolio />}></Route>
            <Route path="/converter" element={<Converter />}></Route>
            <Route path="/xender" element={<Xender/>}></Route>
            <Route path="/receiver" element={<Receiver />}></Route>
            <Route path="/txhistory" element={<Txhistory />}></Route>
            <Route path="/explore" element={<Blog />}></Route>
            <Route path="/verify" element={<Verification />}></Route>
            <Route path="/setting" element={<Setting />}></Route>
          </Routes>
        </Suspense>
      </ThemeProvider>
    </>
  );
}

export default App;
