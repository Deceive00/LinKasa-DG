interface StatusStyleContext {
  applyStyle(): React.CSSProperties;
}


export class IdleStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#ff6961",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}

export class FlyingStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#77dd77",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}