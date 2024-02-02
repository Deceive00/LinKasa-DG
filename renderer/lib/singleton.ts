import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const roles = [
  'Customer Service Manager',
  'Information Desk Staff',
  'Lost and Found Staff',
  'Check-in Staff',
  'Gate Agents',
  'Airport Operations Manager',
  'Flight Operations Manager',
  'Ground Handling Manager',
  'Ground Handling Staff',
  'Landside Operations Manager',
  'Maintenance Manager',
  'Maintenance Staff',
  'Customs and Border Control Officers',
  'Baggage Security Supervisor',
  'Baggage Security Staff',
  'Cargo Manager',
  'Logistic Manager',
  'Fuel Manager',
  'Cargo Handlers',
  'Civil Engineering Manager',
  'Airport Director/CEO',
  'Chief Financial Officer (CFO)',
  'Chief Operations Officer (COO)',
  'Chief Security Officer (CSO)',
  'Human Resource Director'
];

const rolePermission = {
  'Customer Service Manager':[0, 10],
  'Information Desk Staff':[0, 8, 16],
  'Lost and Found Staff':[0, 3],
  'Check-in Staff':[0, 7, 16],
  'Gate Agents':[0, 16],
  'Airport Operations Manager':[0, 7, 16],
  'Flight Operations Manager':[0, 16],
  'Ground Handling Manager':[0, 15],
  'Ground Handling Staff':[0],
  'Landside Operations Manager':[0],
  'Maintenance Manager':[0],
  'Maintenance Staff':[0],
  'Customs and Border Control Officers':[0],
  'Baggage Security Supervisor':[0, 7, 14],
  'Baggage Security Staff':[0],
  'Cargo Manager':[0],
  'Logistic Manager':[0],
  'Fuel Manager':[0],
  'Cargo Handlers':[0],
  'Civil Engineering Manager':[0, 4],
  'Airport Director/CEO':[0, 13],
  'Chief Financial Officer (CFO)':[0, 5],
  'Chief Operations Officer (COO)':[0, 9, 16, 17],
  'Chief Security Officer (CSO)':[0, 6],
  'Human Resource Director':[0, 1, 2, 11, 12]
};

const interdepartmentRole = [
  'Customer Service Manager',
  'Information Desk Staff',
  'Lost and Found Staff',
  'Check-in Staff',
  'Gate Agents',
  'Airport Operations Manager',
  'Flight Operations Manager',
  'Ground Handling Manager',
  'Ground Handling Staff',
  'Landside Operations Manager',
  'Maintenance Manager',
  'Maintenance Staff',
  'Customs and Border Control Officers',
  'Baggage Security Supervisor',
  'Baggage Security Staff',
  'Cargo Manager',
  'Logistic Manager',
  'Cargo Handlers',
  'Civil Engineering Manager',
  'Chief Operations Officer (COO)',
  'Chief Security Officer (CSO)',
];

const globalRole = [
  'Customer Service Manager',
  'Gate Agents',
  'Ground Handling Manager',
  'Landside Operations Manager',
  'Customs and Border Control Officers',
  'Baggage Security Supervisor',
  'Cargo Handlers',
  'Chief Operations Officer (COO)',
  'Airport Operations Manager',
]

const noAccess = [
  'Maintenance Manager',
  'Airport Director/CEO',
  'Chief Financial Officer (CFO)',
  'Human Resource Director',
  'Fuel Manager'
]

const DELETE_DEFAULT_OPTIONS = {
  title: "Are you sure to remove the records??",
  description: "",
  content: null,
  confirmationText: "Ok",
  cancellationText: "Cancel",
  dialogProps: {},
  dialogActionsProps: {},
  confirmationButtonProps: {},
  cancellationButtonProps: {},
  titleProps: {},
  contentProps: {},
  allowClose: true,
  confirmationKeywordTextFieldProps: {},
  hideCancelButton: false,
  buttonOrder: ["cancel", "confirm"],
};
const UPDATE_DEFAULT_OPTIONS = {
  title: "Are you sure to update the records??",
  description: "",
  content: null,
  confirmationText: "Ok",
  cancellationText: "Cancel",
  dialogProps: {},
  dialogActionsProps: {},
  confirmationButtonProps: {},
  cancellationButtonProps: {},
  titleProps: {},
  contentProps: {},
  allowClose: true,
  confirmationKeywordTextFieldProps: {},
  hideCancelButton: false,
  buttonOrder: ["cancel", "confirm"],
};

class Singleton {
  private static instance: Singleton | null = null;

  private constructor() {
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  public getRoles(): string[] {
    return roles;
  }
  public getGlobalRoles(): string[] {
    return globalRole;
  }
  public getInterdepartmentRoles(): string[] {
    return interdepartmentRole;
  }
  public getNoAccess(): string[] {
    return noAccess;
  }

  public getDeleteDefaultOptions(): any {
    return DELETE_DEFAULT_OPTIONS;
  }
  public getUpdateDefaultOptions(): any {
    return UPDATE_DEFAULT_OPTIONS;
  }
  public getRolePermissions(): any {
    return rolePermission;
  }

  public addNotification = async (type, to, message, id) => {
    const notificationData = {
      type: type, 
      message: message,
      timestamp: new Date(),
      uid: id
    };
    const userRoleDocRef = doc(db, 'notifications', to);
    const docSnapshot = await getDoc(userRoleDocRef);

    if (docSnapshot.exists()) {
      await updateDoc(userRoleDocRef, {
        notifications: arrayUnion(notificationData),
      });
    } else {
      await setDoc(userRoleDocRef, {
        notifications: [notificationData],
      });
    }
  }
}

export default Singleton;
