import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider, App as AntApp, theme } from "antd";
import Index from "./pages/Index.tsx";
import Privacy from "./pages/Privacy.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useTheme } from "@/hooks/use-theme";

const queryClient = new QueryClient();

const App = () => {
  const { theme: appTheme } = useTheme();
  const isDark = appTheme === "dark";
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#243958',
          borderRadius: 8,
          controlHeight: 38,
          colorBorder: isDark ? '#303030' : '#d9dde3',
          colorBgContainer: isDark ? '#141414' : '#ffffff',
        },
      }}
    >
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
