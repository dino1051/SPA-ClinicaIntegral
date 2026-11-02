import { Component, type ErrorInfo, type ReactNode } from "react";
import AlertaBanner from "./AlertaBanner";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  tieneError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    tieneError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { tieneError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.tieneError) {
      return (
        this.props.fallback ?? (
          <AlertaBanner
            tipo="error"
            titulo="Algo salió mal"
            mensaje="No fue posible mostrar esta sección. Intenta nuevamente."
          />
        )
      );
    }

    return this.props.children;
  }
}
