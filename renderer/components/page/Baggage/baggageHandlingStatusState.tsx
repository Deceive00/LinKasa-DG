interface StatusStyleContext {
  applyStyle(): React.CSSProperties;
}

const baggageHandlingStatus = [
  'checked',
  'loading',
  'transfer',
  'in transit',
  'unload',
  'received',
  'delayed',
];

export class CheckedStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#264653",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
export class LoadingStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#264653",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
export class TransferStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#2a9d8f",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
export class InTransitStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#e9c46a",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
export class UnloadStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#cda052",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
export class ReceivedStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#f4a261",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
export class DelayedStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#e76f51",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
