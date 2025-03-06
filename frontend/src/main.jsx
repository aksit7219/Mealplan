import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "./context";
import { Provider } from "react-redux";
import store from "./redux/store";
import "../public/css/tailwind.css";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MaterialTailwindControllerProvider>
      </ThemeProvider>

    </BrowserRouter>
  </React.StrictMode>
  </Provider>
);
