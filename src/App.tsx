import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import CityLanding from "@/pages/CityLanding";
import NotFound from "@/pages/NotFound";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";
import BlogCluster from "@/pages/BlogCluster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/topic/:slug" element={<BlogCluster />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* City landing pages */}
            <Route path="/new-york" element={<CityLanding />} />
            <Route path="/los-angeles" element={<CityLanding />} />
            <Route path="/chicago" element={<CityLanding />} />
            <Route path="/dallas" element={<CityLanding />} />
            <Route path="/atlanta" element={<CityLanding />} />
            <Route path="/miami" element={<CityLanding />} />
            <Route path="/houston" element={<CityLanding />} />
            <Route path="/san-francisco" element={<CityLanding />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
