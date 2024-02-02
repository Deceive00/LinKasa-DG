interface StatusStyleContext {
  applyStyle(): React.CSSProperties;
}

const infrastructureHandlingStatus = [
  'under maintenance',
  'operational',
  'unused'
];

export class UnderMaintenanceStyle implements StatusStyleContext {
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
export class OperationalStyle implements StatusStyleContext {
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

export class UnusedStyle implements StatusStyleContext {
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
