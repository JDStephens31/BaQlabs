import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BacktestingPage from "@/pages/backtesting";
import WaitlistPage from "@/pages/waitlist";
import SignInPage from "@/pages/signin";
import NotFoundPage from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WaitlistPage} />
      <Route path="/backtesting" component={BacktestingPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/app" component={BacktestingPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
